import { isNumber } from 'illa/Type'
import { Direction } from 'tty'
import { THand } from '../model/Hands'
import { IWordSlice } from '../model/IWordSlice'
import { TLineParts } from '../model/LineParts'
import { IWordPlan } from '../model/WordPlan'
import { add } from './add'
import { canWordSliceFitIntoLinePart } from './canWordSliceFitIntoLinePart'

export function canWordSliceFitIntoLine({
	lineIndex,
	direction,
	wordSlice: { firstIsFixed, wordParts },
	lineParts,
	hand,
}: {
	lineIndex: number
	direction: Direction
	wordSlice: IWordSlice
	lineParts: TLineParts
	hand: THand
}): IWordPlan[] {
	const firstFixedPart = wordParts[firstIsFixed ? 0 : 1]
	const wordPlans: IWordPlan[] = []
	let lineTileIndices: number[] = []
	for (const [linePartIndex, linePart] of lineParts.entries()) {
		if (isNumber(linePart)) {
			lineTileIndices.push(linePart)
		} else {
			if (linePart.text === firstFixedPart) {
				let wordPlan = canWordSliceFitIntoLinePart({
					lineIndex,
					lineTileIndex: (firstIsFixed
						? lineTileIndices
						: lineTileIndices.slice(0, lineTileIndices.length - 1)
					).reduce(add, 0),
					direction,
					wordParts,
					lineParts: lineParts.slice(
						firstIsFixed ? linePartIndex : linePartIndex - 1,
					),
					hand,
				})
				if (wordPlan) {
					wordPlans.push(wordPlan)
				}
				break
			} else {
				lineTileIndices.push(linePart.fieldCount)
			}
		}
	}
	return wordPlans
}
