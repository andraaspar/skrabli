import { THand } from '../model/Hands'
import { getLettersInHandSet } from './getLettersInHandSet'

export function getLettersInHandRe(hand: THand): string {
	const lettersInHand: string[] = Array.from(getLettersInHandSet(hand)).sort(
		(a, b) => a.length - b.length,
	)
	return `(?:${lettersInHand.join('|')})`
}
