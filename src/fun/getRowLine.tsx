import { BOARD_SIZE } from '../model/Constants'
import { IField } from '../model/Field'

export function getRowLine(
	board: ReadonlyArray<IField>,
	lineIndex: number,
): IField[] {
	const firstFieldIndex = lineIndex * BOARD_SIZE
	return board.slice(firstFieldIndex, firstFieldIndex + BOARD_SIZE)
}
