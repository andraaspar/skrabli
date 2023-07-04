import type { THand } from '../model/THand'

export function getHandValue(hand: THand) {
	return hand.reduce((sum, tile) => sum + (tile ? tile.score : 0), 0)
}
