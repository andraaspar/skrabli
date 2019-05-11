import { isNumber } from 'util'
import { IField } from '../model/Field'

export function getLineParts(line: ReadonlyArray<IField>) {
	let parts: (string | number)[] = []
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
				parts.push(field.tile.letter)
			} else {
				parts[parts.length - 1] += field.tile.letter
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
