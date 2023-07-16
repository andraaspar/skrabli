import { Direction } from '../model/Direction'
import type { IWordPlan } from '../model/IWordPlan'
import type { TBoard } from '../model/TBoard'
import type { THand } from '../model/THand'
import { getLettersInHandRe } from './getLettersInHandRe'
import { getLine } from './getLine'
import { getLineParts } from './getLineParts'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { getWordAt } from './getWordAt'
import { getWordSlices } from './getWordSlices'
import { getWordString } from './getWordString'
import { linePartsToRegExpStrings } from './linePartsToRegExpStrings'
import { theOtherDirection } from './theOtherDirection'
import { wordPlanToBoard } from './wordPlanToBoard'
import { wordSliceAndLinePartsToWordPlan } from './wordSliceAndLinePartsToWordPlan'

export function getPotentialWordsInLine({
	words,
	board,
	lineIndex,
	direction,
	hand,
}: {
	words: string[]
	board: TBoard
	lineIndex: number
	direction: Direction
	hand: THand
}): IWordPlan[] {
	const line = getLine(board, lineIndex, direction)
	if (!line.find((field) => !!field.tile)) return []
	const lettersInHandRe = getLettersInHandRe(hand)
	if (!lettersInHandRe) return []
	const lineParts = getLineParts(line)
	const reStrings = linePartsToRegExpStrings(lettersInHandRe, lineParts)
	const reStringsTrimmed = linePartsToRegExpStrings(
		lettersInHandRe,
		lineParts,
		{ trim: true },
	)
	const re = new RegExp(reStrings.join('|'))
	const res = reStrings.map((s) => new RegExp(s))
	const resTrimmed = reStringsTrimmed.map((s) => new RegExp(s, 'g'))
	return words
		.filter((word) => re.test(word))
		.map((word) => {
			const wordSlices = getWordSlices(word, res, resTrimmed)
			const wordPlans: IWordPlan[] = []
			for (const wordSlice of wordSlices) {
				const newWordPlans = wordSliceAndLinePartsToWordPlan({
					lineIndex,
					direction,
					wordSlice,
					lineParts,
					hand,
				})
				if (newWordPlans.length) {
					wordPlans.push(...newWordPlans)
				}
			}
			return wordPlans
		})
		.reduce((sum, arr) => sum.concat(arr), []) // flatMap not supported until Node 11
		.filter((wordPlan) => {
			const boardPlan = wordPlanToBoard(board, hand, wordPlan)
			for (
				let fieldIndex = wordPlan.fieldIndex,
					lastFieldIndex =
						fieldIndex +
						wordPlan.tiles.length * getFieldIndexOffset(wordPlan.direction);
				fieldIndex < lastFieldIndex;
				fieldIndex += getFieldIndexOffset(wordPlan.direction)
			) {
				const word = getWordAt(
					boardPlan,
					fieldIndex,
					theOtherDirection(wordPlan.direction),
				)
				if (word.word.length > 1 && !words.includes(getWordString(word.word))) {
					return false
				}
			}
			return true
		})
}
