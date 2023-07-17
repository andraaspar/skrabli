import type { THand } from '../model/THand'
import { findLetterIndexInHand } from './findLetterIndexInHand'
import { getLettersInHand } from './getLettersInHand'

export function getHandIndicesForWord(
	word: string,
	originalHand: THand,
): number[] {
	const result: number[] = []
	const hand = originalHand.slice()
	for (let i = 0; i < word.length; ) {
		const wordPart = word.slice(i)
		const lettersInHand = getLettersInHand(hand)
		if (!lettersInHand.length) {
			throw new Error(`[pr6o04] Out of letters.`)
		}
		let letter: string = ''
		for (const letterInHand of lettersInHand) {
			if (wordPart.startsWith(letterInHand)) {
				letter = letterInHand
				break
			}
		}
		if (!letter) {
			throw new Error(`[pr8z2l] No letter in hand matched.`)
		}
		const letterIndex = findLetterIndexInHand(letter, hand)
		if (isNaN(letterIndex)) {
			throw new Error(`[pr52z1] Letter not in hand: ${letter}`)
		} else {
			result.push(letterIndex)
			hand[letterIndex] = null
		}
		i += letter.length
	}
	return result
}
