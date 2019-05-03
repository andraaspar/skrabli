import { isNumber } from 'util'
import { IField } from '../model/Field'
import { THand } from '../model/Hands'
import words from '../res/words.json'

export function getPotentialWordsInLine(
	line: ReadonlyArray<IField>,
	hand: THand,
): string[] {
	if (!line.find(field => !!field.tile)) return []
	const letters: string[] = hand
		.map(tile => (tile ? tile.letter : ''))
		.filter(letter => !!letter && letter !== ' ')
		.sort((a, b) => a.length - b.length)
	const lettersRe = `(${letters.join('|')})`

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
	if (wasGap) {
		parts.push(line.length - lastGapStartIndex)
	}

	const re = partsToRegexp(lettersRe, parts)
	return words.filter(word => re.test(word))
}

export function partsToRegexp(
	lettersRe: string,
	parts: (string | number)[],
): RegExp {
	const reString =
		'^' +
		parts
			.map((part, index) =>
				isNumber(part)
					? `${lettersRe}{${
							index === 0 || index === parts.length - 1
								? `0,${part}`
								: part
					  }}`
					: part,
			)
			.join('') +
		'$'
	return new RegExp(reString)
}
