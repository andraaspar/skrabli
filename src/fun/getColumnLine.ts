import type { IBoardSize } from '@/model/IBoardSize'
import type { IField } from '../model/IField'

export function getColumnLine(
	board: ReadonlyArray<IField>,
	boardSize: IBoardSize,
	columnIndex: number,
): IField[] {
	const column: IField[] = []
	for (let rowIndex = 0; rowIndex < boardSize.height; rowIndex++) {
		column.push(board[rowIndex * boardSize.width + columnIndex])
	}
	return column
}
