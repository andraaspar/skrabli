import { BOARD_SIZE } from '../model/Constants'
import { IField } from '../model/Field'
import { getRowIndex } from './getRowIndex'

export function getRowLine(
	board: ReadonlyArray<IField>,
	fieldIndex: number,
): IField[] {
	const firstFieldIndex = getRowIndex(fieldIndex) * BOARD_SIZE
	return board.slice(firstFieldIndex, firstFieldIndex + BOARD_SIZE)
}
