import { Direction } from '@/model/Direction'
import type { IBoardSize } from '@/model/IBoardSize'
import type { IPlacementInfo } from '@/model/IPlacementInfo'
import type { IWordPlan } from '@/model/IWordPlan'
import type { TBoard } from '@/model/TBoard'
import type { THand } from '@/model/THand'
import { findStartFieldIndex } from './findStartFieldIndex'
import { getAllOwnedWords } from './getAllOwnedWords'
import { getColumnIndex } from './getColumnIndex'
import { getColumnLine } from './getColumnLine'
import { getLettersInHandRe } from './getLettersInHandRe'
import { getLineFieldIndex } from './getLineFieldIndex'
import { getMoveScore } from './getMoveScore'
import { getPlacementInfo } from './getPlacementInfo'
import { getRowIndex } from './getRowIndex'
import { getRowLine } from './getRowLine'
import { getWordInfo } from './getWordInfo'
import { linePartsToRegExpStrings } from './linePartsToRegExpStrings'
import { wordPlanIncludesFieldIndex } from './wordPlanIncludesFieldIndex'
import { wordPlanToBoard } from './wordPlanToBoard'

export function getPotentialStartingWords(
	words: string[],
	board: TBoard,
	boardSize: IBoardSize,
	hand: THand,
): IWordPlan[] {
	const startFieldIndex = findStartFieldIndex(board)
	const startColIndex = getColumnIndex(startFieldIndex, boardSize)
	const startCol = getColumnLine(board, boardSize, startColIndex)
	const startRowIndex = getRowIndex(startFieldIndex, boardSize)
	const startRow = getRowLine(board, boardSize, startRowIndex)
	const lettersInHandRe = getLettersInHandRe(hand)
	if (!lettersInHandRe) return []
	const reStrings = linePartsToRegExpStrings(lettersInHandRe, [
		Math.max(boardSize.width, boardSize.height),
	])
	const re = new RegExp(reStrings.join('|'))
	return words
		.filter((word) => re.test(word))
		.flatMap((word) => {
			const wordPlans: IWordPlan[] = []

			// What tiles in hand will produce this word
			let placementInfo: IPlacementInfo
			try {
				placementInfo = getPlacementInfo(word, hand)
			} catch (e) {
				if (/pr6o04|pr8z2l/.test(e + '')) {
					return []
				} else {
					throw e
				}
			}

			// Check both directions
			for (const direction of [Direction.Horizontal, Direction.Vertical]) {
				const lineIndex =
					direction === Direction.Horizontal ? startRowIndex : startColIndex
				const line = direction === Direction.Horizontal ? startRow : startCol
				let bestScore = -Infinity
				let bestWordPlan: IWordPlan | undefined = undefined

				// Reduce options to the best word plan
				for (
					let fieldIndex = 0;
					fieldIndex < line.length - placementInfo.handIndices.length;
					fieldIndex++
				) {
					const wordPlan: IWordPlan = {
						direction: direction,
						fieldIndex: getLineFieldIndex(
							boardSize,
							direction,
							lineIndex,
							fieldIndex,
						),
						handIndices: placementInfo.handIndices,
						jokerLetters: placementInfo.jokerLetters,
						score: NaN,
						word: word,
					}

					if (
						!wordPlanIncludesFieldIndex(wordPlan, startFieldIndex, boardSize)
					) {
						// Invalid placement, it does not touch the start field
						continue
					}

					const boardWithWord = wordPlanToBoard(
						board,
						boardSize,
						hand,
						wordPlan,
					)
					const wordInfo = getWordInfo(boardWithWord, boardSize)
					const allOwnedWords = getAllOwnedWords(
						boardWithWord,
						boardSize,
						wordInfo,
					)
					const score = getMoveScore(
						allOwnedWords,
						wordPlan.handIndices.length === 7,
					)
					if (score > bestScore) {
						bestScore = score
						bestWordPlan = wordPlan
					}
				}
				if (bestWordPlan) {
					wordPlans.push(bestWordPlan)
				}
			}
			return wordPlans
		})
}
