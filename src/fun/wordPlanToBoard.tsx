import { Draft } from 'immer'
import { TBoard } from '../model/Board'
import { THand } from '../model/Hands'
import { IWordPlan } from '../model/WordPlan'
import { getFieldIndexOffset } from './getNextFieldIndex'

export function wordPlanToBoard(
	board: TBoard,
	hand: THand,
	wordPlan: IWordPlan,
): TBoard {
	const boardDraft: Draft<TBoard> = JSON.parse(JSON.stringify(board))
	const tiles = wordPlan.tiles.map(handIndex =>
		isNaN(handIndex) ? null : JSON.parse(JSON.stringify(hand[handIndex])),
	)
	for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
		const tile = tiles[tileIndex]
		if (tile) {
			const fieldIndex =
				wordPlan.fieldIndex +
				tileIndex * getFieldIndexOffset(wordPlan.direction)
			boardDraft[fieldIndex].tile = tile
		}
	}
	return boardDraft
}
