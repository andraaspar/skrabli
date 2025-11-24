import type { TBoard } from '../model/TBoard'

export function boardIsEmpty(board: TBoard): boolean {
	for (const field of board) {
		if (field.tile) return false
	}
	return true
}
