import { withInterface } from 'illa/Type'
import { Draft } from 'immer'
import { isNumber } from 'util'
import { IField } from '../model/Field'
import { IFixedLinePart } from '../model/IFixedLinePart'
import { TLineParts } from '../model/LineParts'

export function getLineParts(line: ReadonlyArray<IField>) {
	let parts: Draft<TLineParts> = []
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
