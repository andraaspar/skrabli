import type { IBoardSize } from '@/model/IBoardSize'
import type { Direction } from '../model/Direction'
import type { IWordPlan } from '../model/IWordPlan'
import type { IWordSlice } from '../model/IWordSlice'
import type { THand } from '../model/THand'
import type { TLineParts } from '../model/TLineParts'
import { add } from './add'
import { isNumber } from './isNumber'
import { wordSliceAndLinePartsToWordPlanInternal } from './wordSliceAndLinePartsToWordPlanInternal'

export function wordSliceAndLinePartsToWordPlan({
	lineIndex,
	direction,
	wordSlice: { firstIsFixed, wordParts },
	lineParts,
	hand,
	boardSize,
}: {
	lineIndex: number
	direction: Direction
	wordSlice: IWordSlice
	lineParts: TLineParts
	hand: THand
	boardSize: IBoardSize
}): IWordPlan[] {
	const firstFixedPart = wordParts[firstIsFixed ? 0 : 1]
	const wordPlans: IWordPlan[] = []
	const lineTileIndices: number[] = []
	let linePartStartIndex = -1
	for (const [linePartIndex, linePart] of lineParts.entries()) {
		if (isNumber(linePart)) {
			lineTileIndices.push(linePart)
		} else {
			if (linePart.text === firstFixedPart) {
				linePartStartIndex = linePartIndex
				break
			} else {
				lineTileIndices.push(linePart.fieldCount)
			}
		}
	}
	if (linePartStartIndex >= 0) {
		const wordPlan = wordSliceAndLinePartsToWordPlanInternal({
			lineIndex,
			lineTileIndex: (firstIsFixed
				? lineTileIndices
				: lineTileIndices.slice(0, lineTileIndices.length - 1)
			).reduce(add, 0),
			direction,
			wordParts,
			lineParts: lineParts.slice(
				firstIsFixed ? linePartStartIndex : linePartStartIndex - 1,
			),
			hand,
			boardSize,
		})
		if (wordPlan) {
			wordPlans.push(wordPlan)
		}
	}
	return wordPlans
}
