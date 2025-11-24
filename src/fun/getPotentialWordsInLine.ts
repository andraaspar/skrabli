import { Direction } from '../model/Direction'
import type { IBoardSize } from '../model/IBoardSize'
import type { IWordPlan } from '../model/IWordPlan'
import type { TBoard } from '../model/TBoard'
import type { THand } from '../model/THand'
import { getAllOwnedWords } from './getAllOwnedWords'
import { getLettersInHandRe } from './getLettersInHandRe'
import { getLine } from './getLine'
import { getLineParts } from './getLineParts'
import { getMoveScore } from './getMoveScore'
import { getWordInfo } from './getWordInfo'
import { getWordSlices } from './getWordSlices'
import { getWordString } from './getWordString'
import { isWordPlanBingo } from './isWordPlanBingo'
import { linePartsOptionsToRegExpStrings } from './linePartsOptionsToRegExpStrings'
import { linePartsToLinePartsOptions } from './linePartsToLinePartsOptions'
import { wordPlanHash } from './wordPlanHash'
import { wordPlanIncludesFieldIndex } from './wordPlanIncludesFieldIndex'
import { wordPlanToBoard } from './wordPlanToBoard'
import { wordPlanToHand } from './wordPlanToHand'
import { wordSliceToWordPlans } from './wordSliceToWordPlans'

export function getPotentialWordsInLine({
	words,
	board,
	boardSize,
	lineIndex,
	direction,
	hand,
	pinnedFieldIndex,
}: {
	words: string[]
	board: TBoard
	boardSize: IBoardSize
	lineIndex: number
	direction: Direction
	hand: THand
	pinnedFieldIndex?: number
}): Map<string, IWordPlan> {
	const line = getLine(board, boardSize, lineIndex, direction)
	// Skip empty lines
	if (!line.find((field) => !!field.tile)) return new Map()
	const lettersInHandRe = getLettersInHandRe(hand)
	if (!lettersInHandRe) return new Map()
	// Combine sequences of gaps and tiles so we can work with them
	const lineParts = getLineParts(line)
	// Generate multiple combinations of sequences so we can try fitting words
	// into each
	const linePartsOptions = linePartsToLinePartsOptions(lineParts)
	// Create a single regex that can narrow down potential words
	const reStrings = linePartsOptionsToRegExpStrings({
		lettersInHandRe,
		partsOptions: linePartsOptions,
	})
	const re = new RegExp(reStrings.join('|'))
	// Create multiple regexes that can detect which splitting regex should be used
	const res = reStrings.map((s) => new RegExp(s))
	// Create multiple regexes that are suitable for splitting a certain word
	const reStringsTrimmed = linePartsOptionsToRegExpStrings({
		lettersInHandRe,
		partsOptions: linePartsOptions,
		trim: true,
	})
	const resTrimmed = reStringsTrimmed.map((s) => new RegExp(s, 'g'))

	const wordPlans = new Map<string, IWordPlan>()
	for (const word of words) {
		// Words that fail the big regex are not considered further
		if (!re.test(word)) continue
		// Get all the ways the word can be sliced to fit the gaps
		const wordSlices = getWordSlices({
			word,
			res,
			resTrimmed,
			linePartsOptions,
		})
		for (const wordSlice of wordSlices) {
			// Convert slices to plans describing what hand index goes where
			const newWordPlans = wordSliceToWordPlans({
				lineIndex,
				direction,
				wordSlice,
				hand,
				boardSize,
			})
			wordPlansLoop: for (const wordPlan of newWordPlans) {
				if (
					pinnedFieldIndex != null &&
					!wordPlanIncludesFieldIndex(wordPlan, pinnedFieldIndex, boardSize)
				) {
					// If a certain field must be covered but it isn't, we drop the plan
					continue
				}
				const hash = wordPlanHash(wordPlan)
				// This word plan was already found
				if (wordPlans.has(hash)) {
					continue
				}
				// Finalize plans with board and hand outcomes, also a score
				wordPlan.board = wordPlanToBoard(board, boardSize, hand, wordPlan)
				const wordInfo = getWordInfo(wordPlan.board, boardSize)
				// Get all the cross words placed
				const allOwnedWords = getAllOwnedWords(
					wordPlan.board,
					boardSize,
					wordInfo,
				)
				for (const word of allOwnedWords) {
					if (word.length > 1 && !words.includes(getWordString(word))) {
						// If any words found are unknown, we drop the plan
						continue wordPlansLoop
					}
				}
				wordPlan.score = getMoveScore(allOwnedWords, isWordPlanBingo(wordPlan))
				wordPlan.hand = wordPlanToHand(hand, wordPlan)
				// const newHash = wordPlanHash(wordPlan)
				// if (newHash !== hash) {
				// 	throw new Error(`[rz4xfs] ${newHash} !== ${hash}`)
				// }
				wordPlans.set(hash, wordPlan)
			}
		}
	}
	return wordPlans
}
