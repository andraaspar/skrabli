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
			try {
				handIndicesForWord = getHandIndicesForWord(wordPart, hand)
			} catch (e) {
				if (/pr6o04|pr8z2l/.test(e)) {
					return false
				} else {
					throw e
				}
			}
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
		} else {
			if (wordPart !== linePart.text) {
				throw new Error(
					`[pr52yt] Word part is not the same as line part: ${wordPart} !== ${linePart}`,
				)
			}
		}
	}
	return hasMissingParts
}
