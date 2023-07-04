import { Direction } from '../model/Direction'
import type { IField } from '../model/IField'
import type { TBoard } from '../model/TBoard'
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
