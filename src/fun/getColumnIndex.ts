import { BOARD_SIZE } from '../model/Constants'

export function getColumnIndex(fieldIndex: number) {
	return fieldIndex % BOARD_SIZE
}
