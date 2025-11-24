import type { IBoardSize } from '../model/IBoardSize'

export function getColumnIndex(fieldIndex: number, boardSize: IBoardSize) {
	return fieldIndex % boardSize.width
}
