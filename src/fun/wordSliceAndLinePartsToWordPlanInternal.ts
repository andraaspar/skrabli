import type { IBoardSize } from '@/model/IBoardSize'
import { Direction } from '../model/Direction'
import type { IWordPlan } from '../model/IWordPlan'
import type { THand } from '../model/THand'
import type { TLineParts } from '../model/TLineParts'
import { getLineFieldIndex } from './getLineFieldIndex'
import { getPlacementInfo } from './getPlacementInfo'
import { isNumber } from './isNumber'

export function wordSliceAndLinePartsToWordPlanInternal({
	lineIndex,
	lineTileIndex,
	direction,
	wordParts,
	lineParts,
	hand: originalHand,
	boardSize,
}: {
	lineIndex: number
	lineTileIndex: number
	direction: Direction
	wordParts: ReadonlyArray<string>
	lineParts: TLineParts
	hand: THand
	boardSize: IBoardSize
}): IWordPlan | null {
	let hasMissingParts = false
	const hand = originalHand.slice()
	const wordPartsEnd = wordParts.length - 1
	const handIndices: (number | null)[] = []
	const jokerLetters: (string | null)[] = []
	const word = wordParts.join('')
	for (const [index, wordPart] of wordParts.entries()) {
		const linePart = lineParts[index]
		if (isNumber(linePart)) {
			hasMissingParts = true
			let handIndicesForWord: (number | null)[]
			let jokerLettersForWord: (string | null)[]
			try {
				const placementInfo = getPlacementInfo(wordPart, hand)
				handIndicesForWord = placementInfo.handIndices
				jokerLettersForWord = placementInfo.jokerLetters
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
			handIndices.push(...handIndicesForWord)
			jokerLetters.push(...jokerLettersForWord)
			handIndicesForWord.forEach((index) => {
				if (index != null) {
					hand[index] = null
				}
			})
		} else {
			if (wordPart !== linePart.text) {
				throw new Error(
					`[pr52yt] Word part is not the same as line part: ${wordPart} !== ${linePart}`,
				)
			}
			for (let i = 0; i < linePart.fieldCount; i++) {
				handIndices.push(null)
				jokerLetters.push(null)
			}
		}
	}
	if (!hasMissingParts) {
		return null
	}
	return {
		word,
		fieldIndex: getLineFieldIndex(
			boardSize,
			direction,
			lineIndex,
			lineTileIndex,
		),
		direction,
		handIndices,
		jokerLetters,
		score: NaN,
		board: [],
		hand: [],
	}
}
