import { type THand } from '../model/THand'

export function getHandTileCount(hand: THand | null) {
	return (hand || []).reduce((sum, tile) => sum + (tile == null ? 0 : 1), 0)
}
