import type { ILinePartsOption } from '@/model/ILinePartsOption'

export function linePartsOptionsToRegExpStrings({
	lettersInHandRe,
	partsOptions,
	trim,
}: {
	lettersInHandRe: string
	partsOptions: ILinePartsOption[]
	/**
	 * Only match the part from the first fixed tile to the last fixed tile, and
	 * not any of the surrounding gaps (also not word start or end).
	 */
	trim?: boolean
}): string[] {
	const result: string[] = []
	for (const parts of partsOptions) {
		let reString = trim ? '' : '^'
		for (const [index, part] of parts.option.entries()) {
			if (part.gapBefore > 0) {
				// Add hand tiles
				const isFirstPart = index === 0
				const isLastPartOfOnlyGap =
					index === parts.option.length - 1 && !part.text
				if (isFirstPart || isLastPartOfOnlyGap) {
					// First part gap should be trimmed away. Last part gap s
					if (!trim) {
						// Only add if this is not to be trimmed. The number of tiles is
						// zero to the number of fields.
						reString += `(${lettersInHandRe}{0,${part.gapBefore}})`
					}
				} else {
					// The number of tiles must match exactly.
					reString += `(${lettersInHandRe}{${part.gapBefore}})`
				}
			}
			if (part.text) {
				// Add fixed tiles
				reString += `(${part.text})`
			}
		}
		reString += trim ? '' : '$'
		if (reString) {
			result.push(reString)
		} else {
			// Empty regex should match nothing
			result.push('a^') // This matches nothing
		}
	}
	return result
}
