import { isNumber } from 'util'
import { IField } from '../model/Field'
import { THand } from '../model/Hands'
import words from '../res/words.json'

export function getPotentialWordsInLine(
	line: ReadonlyArray<IField>,
	hand: THand,
): string[] {
	if (!line.find(field => !!field.tile)) return []
	const lettersSet = new Set<string>()
	hand.forEach(tile => {
		if (tile && tile.letter !== ' ') {
			lettersSet.add(tile.letter)
		}
	})
	const letters: string[] = Array.from(lettersSet).sort(
		(a, b) => a.length - b.length,
	)
	const lettersRe = `(?:${letters.join('|')})`

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

	const reString = partsToRegExpStrings(lettersRe, parts).join('|')
	// return [reString]
	const re = new RegExp(reString)
	return words.filter(word => re.test(word))
}

export function partsToRegExpStrings(
	lettersRe: string,
	parts: (string | number)[],
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
			result.push(partsToRegExpString(lettersRe, subParts))
		}
	}
	return result
}

export function partsToRegExpString(
	lettersRe: string,
	parts: (string | number)[],
): string {
	let reString = '^'
	parts.forEach((part, index) => {
		if (isNumber(part)) {
			if (part > 0) {
				if (index === 0 || index === parts.length - 1) {
					reString += `${lettersRe}{0,${part}}`
				} else {
					reString += `${lettersRe}{${part}}`
				}
			}
		} else {
			reString += part
		}
	})
	reString += '$'
	return reString
}
