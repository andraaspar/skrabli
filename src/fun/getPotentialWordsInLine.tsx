import { IField } from '../model/Field'
import { THand } from '../model/Hands'

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

	let reBits: string[] = []
	let foundStart = false
	let lastGapStartIndex = -1
	line.forEach((field, index) => {
		if (field.tile) {
			if (!foundStart) {
				foundStart = true
				if (lastGapStartIndex >= 0) {
					reBits.push(`{0,${index - lastGapStartIndex}}`)
				}
			}
			reBits.push(field.tile.letter)
		} else {
		}
	})

	const results: string[] = []
	return results
}
