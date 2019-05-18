import { THand } from '../model/Hands'
import { getLettersInHandSet } from './getLettersInHandSet'

export function getLettersInHand(hand: THand) {
	return Array.from(getLettersInHandSet(hand)).sort(
		(a, b) => a.length - b.length,
	)
}
