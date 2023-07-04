import { LETTERS } from '../model/LETTERS'
import type { THand } from '../model/THand'

export function getLettersInHandSet(hand: THand): Set<string> {
	const lettersInHandSet = new Set<string>()
	hand.forEach((tile) => {
		if (tile) {
			if (tile.letter === ' ') {
				LETTERS.forEach((letter) => lettersInHandSet.add(letter.letter))
			} else {
				lettersInHandSet.add(tile.letter)
			}
		}
	})
	lettersInHandSet.delete(' ')
	return lettersInHandSet
}
