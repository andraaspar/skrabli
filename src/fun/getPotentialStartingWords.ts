import { Direction } from '@/model/Direction'
import type { IBoardSize } from '@/model/IBoardSize'
import type { ILinePartsOption } from '@/model/ILinePartsOption'
import type { IWordPart } from '@/model/IWordPart'
import type { IWordPlan } from '@/model/IWordPlan'
import type { TBoard } from '@/model/TBoard'
import type { THand } from '@/model/THand'
import { findStartFieldIndex } from './findStartFieldIndex'
import { getAllOwnedWords } from './getAllOwnedWords'
import { getColumnIndex } from './getColumnIndex'
import { getLettersInHandRe } from './getLettersInHandRe'
import { getLineFieldIndex } from './getLineFieldIndex'
import { getMoveScore } from './getMoveScore'
import { getPlacementInfos } from './getPlacementInfos'
import { getRowIndex } from './getRowIndex'
import { getWordInfo } from './getWordInfo'
import { isWordPlanBingo } from './isWordPlanBingo'
import { linePartsOptionsToRegExpStrings } from './linePartsOptionsToRegExpStrings'
import { wordPlanHash } from './wordPlanHash'
import { wordPlanIncludesFieldIndex } from './wordPlanIncludesFieldIndex'
import { wordPlanToBoard } from './wordPlanToBoard'
import { wordPlanToHand } from './wordPlanToHand'

export function getPotentialStartingWords({
	words,
	board,
	boardSize,
	hand,
}: {
	words: string[]
	board: TBoard
	boardSize: IBoardSize
	hand: THand
}): Map<string, IWordPlan> {
	const startFieldIndex = findStartFieldIndex(board)
	const startColIndex = getColumnIndex(startFieldIndex, boardSize)
	const startRowIndex = getRowIndex(startFieldIndex, boardSize)
	const lettersInHandRe = getLettersInHandRe(hand)
	if (!lettersInHandRe) return new Map()
	const wordPlans = new Map<string, IWordPlan>()

	for (const direction of [Direction.Horizontal, Direction.Vertical]) {
		// The line has no tiles placed, so create the single line part option manually
		const partsOptions: ILinePartsOption[] = [
			{
				fieldOffset: 0,
				option: [
					{
						gapBefore:
							direction === Direction.Horizontal
								? boardSize.width
								: boardSize.height,
						fieldCount: 0,
						text: '',
					},
				],
			},
		]
		// Create a regex to match valid words based on the tiles in hand
		const reStrings = linePartsOptionsToRegExpStrings({
			lettersInHandRe,
			partsOptions,
		})
		const re = new RegExp(reStrings.join('|'))

		for (const word of words) {
			// Words that fail the regex cannot be placed from this hand, so they are not considered further
			if (!re.test(word)) continue

			const lineIndex =
				direction === Direction.Horizontal ? startRowIndex : startColIndex

			// There is a single part for the word: the gap stretching the entire board.
			const wordParts: IWordPart[] = [
				{
					gapBefore: 0,
					text: word,
					fieldCount:
						direction === Direction.Horizontal
							? boardSize.width
							: boardSize.height,
				},
			]
			// Map tiles to fields.
			const placementInfos = getPlacementInfos({
				fieldOffset: 0,
				wordParts,
				hand,
			})
			for (const placementInfo of placementInfos) {
				let bestScore = -Infinity
				let bestWordPlan: IWordPlan | undefined = undefined
				// Check all possible positions the word can be placed in the line
				for (
					let fieldOffset = 0;
					fieldOffset <= placementInfo.fieldOffset;
					fieldOffset++
				) {
					const wordPlan: IWordPlan = {
						direction: direction,
						fieldIndex: getLineFieldIndex(
							boardSize,
							direction,
							lineIndex,
							fieldOffset,
						),
						handIndices: placementInfo.handIndices,
						jokerLetters: placementInfo.jokerLetters,
						score: NaN,
						word: word,
						board: [],
						hand: [],
					}

					if (
						!wordPlanIncludesFieldIndex(wordPlan, startFieldIndex, boardSize)
					) {
						// Invalid placement, it does not touch the start field
						continue
					}

					wordPlan.board = wordPlanToBoard(board, boardSize, hand, wordPlan)
					const wordInfo = getWordInfo(wordPlan.board, boardSize)
					const allOwnedWords = getAllOwnedWords(
						wordPlan.board,
						boardSize,
						wordInfo,
					)
					wordPlan.score = getMoveScore(
						allOwnedWords,
						isWordPlanBingo(wordPlan),
					)
					if (wordPlan.score > bestScore) {
						wordPlan.hand = wordPlanToHand(hand, wordPlan)
						bestScore = wordPlan.score
						bestWordPlan = wordPlan
					}
				}
				// Only keep the best scoring option
				if (bestWordPlan) {
					wordPlans.set(wordPlanHash(bestWordPlan), bestWordPlan)
				}
			}
		}
	}
	return wordPlans
}
