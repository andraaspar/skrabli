import { BOARD_SIZE } from '../model/Constants'
import { Direction } from '../model/Direction'

export function getFieldIndexOffset(direction: Direction) {
	return direction === Direction.Horizontal ? 1 : BOARD_SIZE
}
