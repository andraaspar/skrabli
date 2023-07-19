import type { IBoardSize } from '@/model/IBoardSize'
import { Direction } from '../model/Direction'
import type { IField } from '../model/IField'
import type { TBoard } from '../model/TBoard'
import { getColumnLine } from './getColumnLine'
import { getRowLine } from './getRowLine'

export function getLine(
	board: TBoard,
	boardSize: IBoardSize,
	lineIndex: number,
	direction: Direction,
): IField[] {
	return direction === Direction.Horizontal
		? getRowLine(board, boardSize, lineIndex)
		: getColumnLine(board, boardSize, lineIndex)
}
