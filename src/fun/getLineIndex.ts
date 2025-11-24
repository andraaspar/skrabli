import { Direction } from '../model/Direction'
import type { IBoardSize } from '../model/IBoardSize'
import { getColumnIndex } from './getColumnIndex'
import { getRowIndex } from './getRowIndex'

export function getLineIndex(
	fieldIndex: number,
	boardSize: IBoardSize,
	direction: Direction,
) {
	return direction === Direction.Horizontal
		? getRowIndex(fieldIndex, boardSize)
		: getColumnIndex(fieldIndex, boardSize)
}
