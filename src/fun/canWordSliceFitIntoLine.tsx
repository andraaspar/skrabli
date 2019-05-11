import { THand } from '../model/Hands'
import { IWordSlice } from '../model/IWordSlice'
import { TLineParts } from '../model/LineParts'
import { canWordSliceFitIntoLinePart } from './canWordSliceFitIntoLinePart'

export function canWordSliceFitIntoLine(
	{ firstIsFixed, wordParts: parts }: IWordSlice,
	lineParts: TLineParts,
	hand: THand,
): boolean {
	const firstFixedPart = parts[firstIsFixed ? 0 : 1]
	for (const [lineIndex, linePart] of lineParts.entries()) {
		if (linePart === firstFixedPart) {
			try {
				if (
					canWordSliceFitIntoLinePart(
						parts,
						lineParts.slice(
							firstIsFixed ? lineIndex : lineIndex - 1,
						),
						hand,
					)
				) {
					return true
				}
			} catch (e) {
				if (!/\[pr8z2l\]/.test(e + '')) {
					throw e
				}
			}
		}
	}
	return false
}
