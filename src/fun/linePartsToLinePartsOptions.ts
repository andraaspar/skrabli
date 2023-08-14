import type { ILinePartsOption } from '@/model/ILinePartsOption'
import type { IWordPart } from '@/model/IWordPart'

export function linePartsToLinePartsOptions(
	parts: IWordPart[],
): ILinePartsOption[] {
	const result: ILinePartsOption[] = []
	// Also calculate the field offset to make it easy to get a field index later
	let fieldOffset = 0
	for (let i = 0; i < parts.length; i++) {
		// Add all possible sequence of parts
		for (let j = i; j < parts.length; j++) {
			const partsOption = parts.slice(i, j + 1)
			// Away from the border: one less gap to put a tile into, as we need separation
			if (i > 0) {
				partsOption[0] = {
					...partsOption[0],
					gapBefore: Math.max(0, partsOption[0].gapBefore - 1),
				}
			}
			// There is a gap to put a tile into and there is text to anchor it to
			if (
				partsOption.find((part) => part.gapBefore > 0) &&
				partsOption.find((part) => part.text)
			) {
				result.push({
					option: partsOption,
					// Separation affects field offset
					fieldOffset: i > 0 ? fieldOffset + 1 : fieldOffset,
				})
			}
			// If this option has at least two items (so we can keep an anchor) and
			// the end has text (i.e. it is not at the border), and there is a gap
			// before the end that we can fit a word's end into, then we can remove
			// the fixed part and have an option that is one field shorter (for
			// separation)
			const partsOptionShort = partsOption.slice()
			const end = partsOptionShort.length - 1
			if (
				partsOptionShort.length > 1 &&
				partsOptionShort[end].text &&
				partsOptionShort[end].gapBefore > 1
			) {
				partsOptionShort[end] = {
					gapBefore: Math.max(0, partsOptionShort[end].gapBefore - 1),
					text: '',
					fieldCount: 0,
				}
				// There is a gap to put a tile into and there is text to anchor it to
				if (
					partsOptionShort.find((part) => part.gapBefore > 0) &&
					partsOptionShort.find((part) => part.text)
				) {
					result.push({
						option: partsOptionShort,
						// Separation affects field offset
						fieldOffset: i > 0 ? fieldOffset + 1 : fieldOffset,
					})
				}
			}
		}
		fieldOffset += parts[i].gapBefore + parts[i].fieldCount
	}
	return result
}
