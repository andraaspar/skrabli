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
	while (true) {
		if (re.lastIndex >= word.length) {
			break
		}
		const lettersInHandRe = getLettersInHandRe(hand)
		if (!lettersInHandRe) {
			throw new Error(`[pr6o04] Out of letters.`)
		}
		const newRe = new RegExp(`(${lettersInHandRe})`, 'g')
		newRe.lastIndex = re.lastIndex
		re = newRe
		const match = re.exec(word)
		if (!match) {
			throw new Error(`[pr8z2l] No letter in hand matched.`)
		}
		const letter = match[0]
		const letterIndex = findLetterIndexInHand(letter, hand)
		if (isNaN(letterIndex)) {
			throw new Error(`[pr52z1] Letter not in hand: ${letter}`)
		} else {
			result.push(letterIndex)
			hand[letterIndex] = null
		}
	}
	return result
}
