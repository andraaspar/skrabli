import { isNumber } from 'illa/Type'
import { BOARD_SIZE } from '../model/Constants'
import { Direction } from '../model/Direction'
import { THand } from '../model/Hands'
import { TLineParts } from '../model/LineParts'
import { IWordPlan } from '../model/WordPlan'
import { getHandIndicesForWord } from './getHandIndicesForWord'

export function wordSliceAndLinePartsToWordPlanInternal({
	lineIndex,
	lineTileIndex,
	direction,
	wordParts,
	lineParts,
	hand: originalHand,
}: {
	lineIndex: number
	lineTileIndex: number
	direction: Direction
	wordParts: ReadonlyArray<string>
	lineParts: TLineParts
	hand: THand
}): IWordPlan | null {
	let hasMissingParts = false
	let hand = originalHand.slice()
	const wordPartsEnd = wordParts.length - 1
	let tiles: number[] = []
	const word = wordParts.join('')
	// if (word === 'aggkor') {
	// 	console.log('.')
	// }
	for (const [index, wordPart] of wordParts.entries()) {
		const linePart = lineParts[index]
		if (isNumber(linePart)) {
			hasMissingParts = true
			let handIndicesForWord: number[]
			try {
				handIndicesForWord = getHandIndicesForWord(wordPart, hand)
			} catch (e) {
				if (/pr6o04|pr8z2l/.test(e + '')) {
					return null
				} else {
					throw e
				}
			}
			if (index === 0 || index === wordPartsEnd) {
				if (handIndicesForWord.length > linePart) {
					return null
				}
			} else {
				if (handIndicesForWord.length !== linePart) {
					return null
				}
			}
			if (index === 0) {
				lineTileIndex += linePart - handIndicesForWord.length
			}
			tiles.push(...handIndicesForWord)
			handIndicesForWord.forEach((index) => (hand[index] = null))
		} else {
			if (wordPart !== linePart.text) {
				throw new Error(
					`[pr52yt] Word part is not the same as line part: ${wordPart} !== ${linePart}`,
				)
			}
			for (let i = 0; i < linePart.fieldCount; i++) {
				tiles.push(NaN)
			}
		}
	}
	if (!hasMissingParts) {
		return null
	}
	return {
		word,
		fieldIndex:
			direction === Direction.Horizontal
				? lineIndex * BOARD_SIZE + lineTileIndex
				: lineTileIndex * BOARD_SIZE + lineIndex,
		direction,
		tiles,
		score: NaN,
	}
}
