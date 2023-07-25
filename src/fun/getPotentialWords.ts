import type { IBoardSize } from '@/model/IBoardSize'
import { Direction } from '../model/Direction'
import type { IWordPlan } from '../model/IWordPlan'
import type { TBoard } from '../model/TBoard'
import type { THand } from '../model/THand'
import { boardIsEmpty } from './boardIsEmpty'
import { getLineIndex } from './getLineIndex'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { getPotentialStartingWords } from './getPotentialStartingWords'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'
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
		getPotentialStartingWords(words, board, boardSize, hand).forEach(
			(wordPlan) => {
				wordPlansMap.set(wordPlanHash(wordPlan), wordPlan)
			},
		)
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
				getPotentialWordsInLine({
					...options,
					direction,
					lineIndex,
				}).forEach((wordPlan) => {
					wordPlansMap.set(wordPlanHash(wordPlan), wordPlan)
				})
			}
		}
		// Search for cross opportunities on single tile plans. This should find extra
		// opportunities that are just next to placed tiles, in an empty line. Empty
		// lines are normally skipped, so we need to look at them here.
		let crossWordPlans: IWordPlan[] = []
		for (const wordPlan of wordPlansMap.values()) {
			// Find the number of played tiles
			const tilesToPlace = wordPlan.handIndices.filter((tile) => !isNaN(tile))
			// Only check for cross tiles if there was but a single tile played and
			// there are no neighboring tiles in the cross direction.
			if (tilesToPlace.length === 1) {
				const placedTileIndex = wordPlan.handIndices.indexOf(tilesToPlace[0])
				const placedTileFieldIndex =
					wordPlan.fieldIndex +
					getFieldIndexOffset(wordPlan.direction, boardSize) * placedTileIndex
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
						board: wordPlanToBoard(board, boardSize, hand, wordPlan), // Place the placed tile on the board
						lineIndex: getLineIndex(
							placedTileFieldIndex,
							boardSize,
							crossDirection,
						),
						boardSize,
						direction: crossDirection,
						hand: wordPlanToHand(hand, wordPlan), // Remove the placed tile from the hand
						pinnedFieldIndex: placedTileFieldIndex, // Only include plans that span the placed tile
					})
					for (const newPlan of newPlans) {
						// Add the placed tile to the right location in the new plans
						replaceHandIndexInWordPlan(
							newPlan,
							placedTileFieldIndex,
							tilesToPlace[0],
							boardSize,
						)
					}
					crossWordPlans = crossWordPlans.concat(newPlans)
				}
			}
		}
		for (const crossWordPlan of crossWordPlans) {
			wordPlansMap.set(wordPlanHash(crossWordPlan), crossWordPlan)
		}
	}
	return Array.from(wordPlansMap.values()).sort(
		(a, b) =>
			a.direction - b.direction ||
			a.fieldIndex - b.fieldIndex ||
			a.handIndices.length - b.handIndices.length,
	)
}
