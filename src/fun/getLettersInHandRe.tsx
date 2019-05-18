import { THand } from '../model/Hands'
import { getLettersInHand } from './getLettersInHand'

export function getLettersInHandRe(hand: THand): string {
	const lettersInHand: string[] = getLettersInHand(hand)
	if (lettersInHand.length) {
		return `(?:${lettersInHand.join('|')})`
	} else {
		return ''
	}
}
