import { Direction } from '@/model/Direction'
import type { IBoardSize } from '@/model/IBoardSize'

export function getLineFieldIndex(
	boardSize: IBoardSize,
	direction: Direction,
	lineIndex: number,
	lineFieldIndex: number,
) {
	return direction === Direction.Horizontal
		? lineIndex * boardSize.width + lineFieldIndex
		: lineFieldIndex * boardSize.width + lineIndex
}
