import { Direction } from '../model/Direction'
import type { IBoardSize } from '../model/IBoardSize'
import type { IWordPlan } from '../model/IWordPlan'
import type { TBoard } from '../model/TBoard'
import type { THand } from '../model/THand'
import { boardIsEmpty } from './boardIsEmpty'
import { getAllOwnedWords } from './getAllOwnedWords'
import { getLineIndex } from './getLineIndex'
import { getMoveScore } from './getMoveScore'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { getPotentialStartingWords } from './getPotentialStartingWords'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'
import { getWordInfo } from './getWordInfo'
import { isWordPlanBingo } from './isWordPlanBingo'
import { replaceHandIndexInWordPlan } from './replaceHandIndexInWordPlan'
import { theOtherDirection } from './theOtherDirection'
import { wordPlanHash } from './wordPlanHash'
import { wordPlanToBoard } from './wordPlanToBoard'
import { wordPlanToHand } from './wordPlanToHand'

export function getPotentialWords(options: {
	words: string[]
	board: TBoard
	boardSize: IBoardSize
	hand: THand
}) {
	const { board, boardSize, words, hand } = options

	const wordPlansMap = new Map<string, IWordPlan>()

	if (boardIsEmpty(board)) {
		const wordPlans = getPotentialStartingWords({
			words,
			board,
			boardSize,
			hand,
		})
		for (const [hash, wordPlan] of wordPlans) {
			wordPlansMap.set(hash, wordPlan)
		}
	} else {
		// let wordPlans: IWordPlan[] = []
		// Find plans in lines that already have tiles
		for (const direction of [Direction.Horizontal, Direction.Vertical]) {
			for (
				let lineIndex = 0;
				lineIndex <
				(direction === Direction.Horizontal
					? boardSize.height
					: boardSize.width);
				lineIndex++
			) {
				const wordPlans = getPotentialWordsInLine({
					...options,
					direction,
					lineIndex,
				})
				for (const [hash, wordPlan] of wordPlans) {
					wordPlansMap.set(hash, wordPlan)
				}
			}
		}
		// Search for cross opportunities on single tile plans. This should find extra
		// opportunities that are just next to placed tiles, in an empty line. Empty
		// lines are normally skipped, so we need to look at them here.
		for (const wordPlan of wordPlansMap.values()) {
			// Find the number of played tiles
			const tilesToPlace = wordPlan.handIndices.filter(
				(tile): tile is number => tile != null,
			)
			// Only check for cross tiles if there was but a single tile played and
			// there are no neighboring tiles in the cross direction.
			if (tilesToPlace.length === 1) {
				const placedTileFieldIndex = wordPlan.board.findIndex(
					(field) => field.tile?.isOwned,
				)
				const crossDirection = theOtherDirection(wordPlan.direction)
				const crossDirectionOffset = getFieldIndexOffset(
					crossDirection,
					boardSize,
				)
				// Only if adjacent tiles in the cross direction are empty
				if (
					board[placedTileFieldIndex - crossDirectionOffset]?.tile == null &&
					board[placedTileFieldIndex + crossDirectionOffset]?.tile == null
				) {
					const newPlans = getPotentialWordsInLine({
						words,
						board: wordPlan.board,
						lineIndex: getLineIndex(
							placedTileFieldIndex,
							boardSize,
							crossDirection,
						),
						boardSize,
						direction: crossDirection,
						hand: wordPlan.hand,
						pinnedFieldIndex: placedTileFieldIndex, // Only include plans that span the placed tile
					})
					for (const newPlan of newPlans.values()) {
						// Add the placed tile to the right location in the new plans
						replaceHandIndexInWordPlan(
							newPlan,
							placedTileFieldIndex,
							tilesToPlace[0]!,
							boardSize,
						)
						// Need a new hash, because the hand changed
						const hash = wordPlanHash(newPlan)
						if (wordPlansMap.has(hash)) continue
						// Redo board and hand to make it a single move
						newPlan.hand = wordPlanToHand(hand, newPlan)
						newPlan.board = wordPlanToBoard(board, boardSize, hand, newPlan)
						const wordInfo = getWordInfo(newPlan.board, boardSize)
						const allOwnedWords = getAllOwnedWords(
							newPlan.board,
							boardSize,
							wordInfo,
						)
						newPlan.score = getMoveScore(
							allOwnedWords,
							isWordPlanBingo(newPlan),
						)
						wordPlansMap.set(hash, newPlan)
					}
				}
			}
		}
	}
	// for (const [hash, wordPlan] of wordPlansMap) {
	// 	const newHash = wordPlanHash(wordPlan)
	// 	if (newHash !== hash) {
	// 		throw new Error(`[rz4x5q] ${newHash} !== ${hash}`)
	// 	}
	// }
	return Array.from(wordPlansMap.values()).sort(
		(a, b) =>
			a.direction - b.direction ||
			a.fieldIndex - b.fieldIndex ||
			a.handIndices.length - b.handIndices.length,
	)
}
