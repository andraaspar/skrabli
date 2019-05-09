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
	const wordPartsEnd = wordParts.length - 1
	for (const [index, wordPart] of wordParts.entries()) {
		const linePart = lineParts[index]
		if (isNumber(linePart)) {
			hasMissingParts = true
			let handIndicesForWord: number[]
			handIndicesForWord = getHandIndicesForWord(wordPart, hand)
			if (index === 0 || index === wordPartsEnd) {
				if (handIndicesForWord.length > linePart) {
					return false
				}
			} else {
				if (handIndicesForWord.length !== linePart) {
					return false
				}
			}
			handIndicesForWord.forEach(index => (hand[index] = null))
		} else if (isString(linePart)) {
			if (wordPart !== linePart) {
				throw new Error(
					`[pr52yt] Word part is not the same as line part: ${wordPart} !== ${linePart}`,
				)
			}
		} else {
			throw new Error(`[pr52yo]`)
		}
	}
	return hasMissingParts
}
