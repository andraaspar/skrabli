import type { IBoardSize } from '../model/IBoardSize'

export function getRowIndex(fieldIndex: number, boardSize: IBoardSize) {
	return Math.floor(fieldIndex / boardSize.width)
}
