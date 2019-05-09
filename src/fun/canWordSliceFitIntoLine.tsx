import { THand } from '../model/Hands'
import { IWordSlice } from '../model/IWordSlice'
import { TLineParts } from '../model/LineParts'
import { canWordSliceFitIntoLinePart } from './canWordSliceFitIntoLinePart'

export function canWordSliceFitIntoLine(
	{ startMissing, wordParts: parts }: IWordSlice,
	lineParts: TLineParts,
	hand: THand,
): boolean {
	const firstFixedPart = parts[startMissing ? 1 : 0]
	for (const [lineIndex, linePart] of lineParts.entries()) {
		if (linePart === firstFixedPart) {
			try {
				if (
					canWordSliceFitIntoLinePart(
						parts,
						lineParts.slice(
							startMissing ? lineIndex - 1 : lineIndex,
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
