import { type IField } from '../model/IField'
import { type IWordPart } from '../model/IWordPart'

/**
 * Converts a line of fields to { gapBefore, text, fieldCount }.
 */
export function getLineParts(line: ReadonlyArray<IField>): IWordPart[] {
	const parts: IWordPart[] = []
	let wasGap = false
	for (const [index, field] of line.entries()) {
		if (field.tile) {
			// There is a tile here
			if (index === 0) {
				// There was no previous field, so add the initial part
				parts.push({ gapBefore: 0, text: field.tile.letter, fieldCount: 1 })
			} else {
				// Append text to the last part
				const fixedLinePart = parts[parts.length - 1] as IWordPart
				fixedLinePart.text += field.tile.letter
				fixedLinePart.fieldCount++
			}
			wasGap = false
		} else {
			// There is an empty field here
			if (wasGap) {
				// The last field was also a gap, increment gap length
				parts[parts.length - 1]!.gapBefore++
			} else {
				// The last field was not a gap, add a new part
				parts.push({ gapBefore: 1, text: '', fieldCount: 0 })
			}
			wasGap = true
		}
	}
	return parts
}
