import { BOARD_SIZE } from '../model/Constants'

export function getRowIndex(fieldIndex: number) {
	return Math.floor(fieldIndex / BOARD_SIZE)
}
