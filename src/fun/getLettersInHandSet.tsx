import { THand } from '../model/Hands'
import letters from '../res/letters.json'
export function getLettersInHandSet(hand: THand): Set<string> {
	const lettersInHandSet = new Set<string>()
	hand.forEach(tile => {
		if (tile) {
			if (tile.letter === ' ') {
				letters.forEach(letter => lettersInHandSet.add(letter.letter))
			} else {
				lettersInHandSet.add(tile.letter)
			}
		}
	})
	lettersInHandSet.delete(' ')
	return lettersInHandSet
}
