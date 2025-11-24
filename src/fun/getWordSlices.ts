import type { ILinePartsOption } from '../model/ILinePartsOption'
import type { IWordPart } from '../model/IWordPart'
import type { IWordSlice } from '../model/IWordSlice'

export function getWordSlices({
	word,
	res,
	resTrimmed,
	linePartsOptions,
}: {
	word: string
	res: ReadonlyArray<RegExp>
	resTrimmed: ReadonlyArray<RegExp>
	linePartsOptions: ILinePartsOption[]
}): IWordSlice[] {
	const result: IWordSlice[] = []
	for (const [reIndex, re] of res.entries()) {
		// Find a splitting regex that should work by using the full regex
		if (re.test(word)) {
			// Get the matching splitting regex
			const reTrimmed = resTrimmed[reIndex]!
			// By utilizing the fact that regexes come from line parts options we can
			// get the line parts option that was used to generate the regex
			const linePartsOption = linePartsOptions[reIndex]!
			// Attempt splitting at multiple locations in the word
			for (let reTrimmedStartIndex = 0; reTrimmedStartIndex < word.length; ) {
				reTrimmed.lastIndex = reTrimmedStartIndex
				const trimmedMatch = reTrimmed.exec(word)
				// If the word cannot be split from this location, stop attempts
				if (!trimmedMatch) break
				const matchStartIndex = trimmedMatch.index
				const matchEndIndex = reTrimmed.lastIndex // Exclusive
				// Omit first item, that is the entire matched word.
				const wordPartStrings = trimmedMatch.slice(1, trimmedMatch.length)
				// Whether the first match will be a fixed part. We can tell because the
				// trimmed regex is trimmed to fixed parts.
				const isFixedFirst = matchStartIndex === 0
				// Trimmed regex may omit the start and the end of the word, so add them
				// back if necessary.
				if (!isFixedFirst) {
					// Add empty fixed part and the word start
					wordPartStrings.unshift('', word.slice(0, matchStartIndex))
				}
				if (matchEndIndex < word.length) {
					wordPartStrings.push(word.slice(matchEndIndex))
				}
				const wordParts: IWordPart[] = []
				// Fixed set of tiles will become gaps, not fixed parts will be texts.
				// The first part is fixed if the slicing regex matched at the beginning
				// of the word.
				let hasGap = false
				for (
					let stringIndex = 0;
					stringIndex < wordPartStrings.length;
					stringIndex += 2
				) {
					const handString = wordPartStrings[stringIndex + 1] ?? ''
					// If there is something that should come from the hand, then we have
					// a gap to fill from the hand
					if (handString) hasGap = true
					// Invert line parts into word parts: gaps become texts and texts
					// become gaps
					if (isFixedFirst) {
						// There was no added back word part, so we can iterate normally
						const fixedLinePart = linePartsOption.option[stringIndex / 2]!
						const handLinePart = linePartsOption.option[stringIndex / 2 + 1]
						wordParts.push({
							gapBefore: fixedLinePart.fieldCount,
							text: handString,
							// In word slices, the fieldCount indicates the available space,
							// so it does not match the text length
							fieldCount: handLinePart?.gapBefore ?? 0,
						})
					} else {
						// Must account for added back word start
						const fixedLinePart = linePartsOption.option[(stringIndex - 2) / 2]
						const handLinePart =
							linePartsOption.option[(stringIndex - 2) / 2 + 1]
						wordParts.push({
							gapBefore: fixedLinePart?.fieldCount ?? 0,
							text: handString,
							// In word slices, the fieldCount indicates the available space,
							// so it does not match the text length
							fieldCount: handLinePart?.gapBefore ?? 0,
						})
					}
				}
				if (hasGap) {
					// Only add the result if it has a gap for at least a single tile to
					// place
					result.push({
						word,
						wordParts,
						fieldOffset: isFixedFirst
							? linePartsOption.fieldOffset +
							  linePartsOption.option[0]!.gapBefore
							: linePartsOption.fieldOffset,
					})
				}
				// Advance beyond the start of the last splitting
				reTrimmedStartIndex = matchStartIndex + 1
			}
		}
	}
	return result
}
