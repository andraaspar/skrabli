import { isNumber } from 'illa/Type'
import { THand } from '../model/Hands'
import { IWordSlice } from '../model/IWordSlice'
import { TLineParts } from '../model/LineParts'
import { canWordSliceFitIntoLinePart } from './canWordSliceFitIntoLinePart'

export function canWordSliceFitIntoLine(
	{ firstIsFixed, wordParts }: IWordSlice,
	lineParts: TLineParts,
	hand: THand,
): boolean {
	const firstFixedPart = wordParts[firstIsFixed ? 0 : 1]
	for (const [lineIndex, linePart] of lineParts.entries()) {
		if (!isNumber(linePart) && linePart.text === firstFixedPart) {
			if (
				canWordSliceFitIntoLinePart(
					wordParts,
					lineParts.slice(firstIsFixed ? lineIndex : lineIndex - 1),
					hand,
				)
			) {
				return true
			}
		}
	}
	return false
}
