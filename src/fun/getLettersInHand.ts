import { JOKER_LETTERS } from '../model/JOKER_LETTERS'
import type { THand } from '../model/THand'

export function getLettersInHand(hand: THand) {
	const letters = new Set<string>()
	for (const tile of hand) {
		if (tile?.isJoker) {
			return JOKER_LETTERS
		} else if (tile) {
			letters.add(tile.letter)
		}
	}
	return Array.from(letters)
}
