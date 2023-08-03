import type { THand } from '../model/THand'

export function findLetterIndexInHand(
	letter: string,
	hand: THand,
): number | null {
	let result: number | null = null
	for (const [index, tile] of hand.entries()) {
		if (tile != null && tile.letter === letter) {
			result = index
			break
		}
	}
	if (result == null) {
		for (const [index, tile] of hand.entries()) {
			if (tile != null && tile.letter === ' ') {
				result = index
			}
		}
	}
	return result
}
