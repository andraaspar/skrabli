import type { IBoardSize } from '@/model/IBoardSize'
import { Direction } from '../model/Direction'

export function getFieldIndexOffset(
	direction: Direction,
	boardSize: IBoardSize,
) {
	return direction === Direction.Horizontal ? 1 : boardSize.width
}
