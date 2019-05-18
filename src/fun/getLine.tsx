import { TBoard } from '../model/Board'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { getColumnLine } from './getColumnLine'
import { getRowLine } from './getRowLine'

export function getLine(
	board: TBoard,
	lineIndex: number,
	direction: Direction,
): IField[] {
	return direction === Direction.Horizontal
		? getRowLine(board, lineIndex)
		: getColumnLine(board, lineIndex)
}
