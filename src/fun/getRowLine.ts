import { BOARD_SIZE } from '../model/Constants'
import { type IField } from '../model/IField'

export function getRowLine(
	board: ReadonlyArray<IField>,
	lineIndex: number,
): IField[] {
	const firstFieldIndex = lineIndex * BOARD_SIZE
	return board.slice(firstFieldIndex, firstFieldIndex + BOARD_SIZE)
}
