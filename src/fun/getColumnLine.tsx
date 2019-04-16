import { BOARD_SIZE } from '../model/Constants'
import { IField } from '../model/Field'
import { getColumnIndex } from './getColumnIndex'
export function getColumnLine(
	board: ReadonlyArray<IField>,
	fieldIndex: number,
): IField[] {
	const columnIndex = getColumnIndex(fieldIndex)
	const column: IField[] = []
	for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
		column.push(board[rowIndex * BOARD_SIZE + columnIndex])
	}
	return column
}
