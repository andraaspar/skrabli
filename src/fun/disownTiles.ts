import type { TBoard } from '@/model/TBoard'

export function disownTiles(board: TBoard): void {
	for (const field of board) {
		if (field.tile) {
			if (field.tile.isOwned) {
				field.tile.isOwned = null
				field.tile.isLast = true
			} else if (field.tile.isLast) {
				field.tile.isLast = null
			}
		}
	}
}
