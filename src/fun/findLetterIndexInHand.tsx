import { THand } from '../model/Hands'

export function findLetterIndexInHand(letter: string, hand: THand): number {
	let result: number = NaN
	for (const [index, tile] of hand.entries()) {
		if (tile != null && tile.letter === letter) {
			result = index
			break
		}
	}
	if (isNaN(result)) {
		for (const [index, tile] of hand.entries()) {
			if (tile != null && tile.letter === ' ') {
				result = index
			}
		}
	}
	return result
}
