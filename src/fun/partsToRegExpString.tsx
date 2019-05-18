import { isNumber } from 'util'
import { TLineParts } from '../model/LineParts'

export function partsToRegExpString(
	lettersInHandRe: string,
	parts: TLineParts,
	{
		trim,
	}: {
		trim?: boolean
	} = {},
): string {
	let reString = trim ? '' : '^'
	parts.forEach((part, index) => {
		if (isNumber(part)) {
			if (part > 0) {
				if (index === 0 || index === parts.length - 1) {
					if (!trim) {
						reString += `(${lettersInHandRe}{0,${part}})`
					}
				} else {
					reString += `(${lettersInHandRe}{${part}})`
				}
			}
		} else {
			reString += `(${part.text})`
		}
	})
	reString += trim ? '' : '$'
	return reString
}
