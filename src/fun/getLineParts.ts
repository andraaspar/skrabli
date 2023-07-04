import { type IField } from '../model/IField'
import { type IFixedLinePart } from '../model/IFixedLinePart'
import { type TLineParts } from '../model/TLineParts'
import { isNumber } from './isNumber'
import { withInterface } from './withInterface'

export function getLineParts(line: ReadonlyArray<IField>) {
	let parts: TLineParts = []
	let wasGap = false
	let lastGapStartIndex = -1
	line.forEach((field, index) => {
		if (field.tile) {
			if (wasGap) {
				if (lastGapStartIndex >= 0) {
					parts.push(index - lastGapStartIndex)
				}
			}
			if (wasGap || index === 0) {
				parts.push(
					withInterface<IFixedLinePart>({
						text: field.tile.letter,
						fieldCount: 1,
					}),
				)
			} else {
				const fixedLinePart = parts[parts.length - 1] as IFixedLinePart
				fixedLinePart.text += field.tile.letter
				fixedLinePart.fieldCount++
			}
			wasGap = false
		} else {
			if (!wasGap) {
				wasGap = true
				lastGapStartIndex = index
			}
		}
	})
	parts.push(wasGap ? line.length - lastGapStartIndex : 0)
	if (!isNumber(parts[0])) parts.unshift(0)
	if (!isNumber(parts[parts.length - 1])) parts.push(0)
	return parts
}
