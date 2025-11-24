import type { IBoardSize } from '../model/IBoardSize'
import type { IWordPlan } from '../model/IWordPlan'
import type { TBoard } from '../model/TBoard'
import type { THand } from '../model/THand'
import { disownTiles } from './disownTiles'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { jsonClone } from './jsonClone'

export function wordPlanToBoard(
	board: TBoard,
	boardSize: IBoardSize,
	hand: THand,
	wordPlan: IWordPlan,
): TBoard {
	const boardDraft = jsonClone(board)
	disownTiles(boardDraft)
	const tiles = wordPlan.handIndices.map((handIndex) =>
		handIndex == null ? null : jsonClone(hand[handIndex]),
	)
	for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
		const tile = jsonClone(tiles[tileIndex])
		if (tile) {
			const fieldIndex =
				wordPlan.fieldIndex +
				tileIndex * getFieldIndexOffset(wordPlan.direction, boardSize)
			const field = boardDraft[fieldIndex]!
			field.tile = tile
			tile.isOwned = true
			if (tile.isJoker) {
				tile.letter = wordPlan.jokerLetters[tileIndex]!
			}
		}
	}
	return boardDraft
}
