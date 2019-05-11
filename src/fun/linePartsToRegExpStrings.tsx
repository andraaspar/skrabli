import { partsToRegExpString } from './partsToRegExpString'

export function linePartsToRegExpStrings(
	lettersInHandRe: string,
	parts: (string | number)[],
	{
		trim,
	}: {
		trim?: boolean
	} = {},
): string[] {
	const result: string[] = []
	for (let startIndex = 0; startIndex < parts.length - 2; startIndex += 2) {
		for (
			let endIndex = startIndex + 2;
			endIndex < parts.length;
			endIndex += 2
		) {
			let subParts = parts.slice(startIndex, endIndex + 1)
			if (startIndex > 0) {
				subParts[0] = Math.max(0, (subParts[0] as number) - 1)
			}
			if (endIndex < parts.length - 1) {
				const end = subParts.length - 1
				subParts[end] = Math.max(0, (subParts[end] as number) - 1)
			}
			result.push(
				partsToRegExpString(lettersInHandRe, subParts, { trim }),
			)
		}
	}
	return result
}
