import { isUndefinedOrNull } from 'illa/Type'
import { THand } from '../model/Hands'

export function getHandTileCount(hand: THand | null) {
	return (hand || []).reduce(
		(sum, tile) => sum + (isUndefinedOrNull(tile) ? 0 : 1),
		0,
	)
}
