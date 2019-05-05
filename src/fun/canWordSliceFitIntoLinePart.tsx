import { isString } from 'illa/Type'
import { isNumber } from 'util'
import { THand } from '../model/Hands'
import { TLineParts } from '../model/LineParts'
import { getHandIndicesForWord } from './getHandIndicesForWord'

export function canWordSliceFitIntoLinePart(
	wordParts: ReadonlyArray<string>,
	lineParts: TLineParts,
	originalHand: THand,
): boolean {
	let hasMissingParts = false
	let hand = originalHand.slice()
	for (const [index, wordPart] of wordParts.entries()) {
		const linePart = lineParts[index]
		if (isNumber(linePart)) {
			hasMissingParts = true
			let handIndicesForWord: number[]
			try {
				handIndicesForWord = getHandIndicesForWord(wordPart, hand)
			} catch (e) {
				return false
			}
			handIndicesForWord.forEach(index => (hand[index] = null))
		} else if (isString(linePart)) {
			if (wordPart !== linePart) {
				return false
			}
		} else {
			return false
		}
	}
	return hasMissingParts
}
