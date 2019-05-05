import { THand } from '../model/Hands'
import { findLetterIndexInHand } from './findLetterIndexInHand'
import { getLettersInHandRe } from './getLettersInHandRe'

export function getHandIndicesForWord(
	word: string,
	originalHand: THand,
): number[] {
	let result: number[] = []
	let hand = originalHand.slice()
	let re: RegExp = /./
	let newRe: RegExp
	let match: RegExpMatchArray | null
	while (
		((newRe = new RegExp(`(${getLettersInHandRe(hand)})`, 'g')),
		(newRe.lastIndex = re.lastIndex),
		(re = newRe),
		(match = re.exec(word)))
	) {
		const letter = match[0]
		const letterIndex = findLetterIndexInHand(letter, hand)
		if (isNaN(letterIndex)) {
			throw new Error(`Letter not in hand: ${letter}`)
		} else {
			result.push(letterIndex)
		}
	}
	return result
}
