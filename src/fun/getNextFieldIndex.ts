import { Direction } from '../model/Direction'
import type { IBoardSize } from '../model/IBoardSize'

export function getFieldIndexOffset(
	direction: Direction,
	boardSize: IBoardSize,
) {
	return direction === Direction.Horizontal ? 1 : boardSize.width
}
