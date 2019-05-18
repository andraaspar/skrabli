import { TBoard } from '../model/Board'
import { Direction } from '../model/Direction'
import { THand } from '../model/Hands'
import words from '../res/words.json'
import { canWordSliceFitIntoLine } from './canWordSliceFitIntoLine'
import { getLettersInHandRe } from './getLettersInHandRe'
import { getLine } from './getLine'
import { getLineParts } from './getLineParts'
import { getWordSlices } from './getWordSlices'
import { linePartsToRegExpStrings } from './linePartsToRegExpStrings'

export function getPotentialWordsInLine(
	board: TBoard,
	lineIndex: number,
	direction: Direction,
	hand: THand,
): string[] {
	const line = getLine(board, lineIndex, direction)
	if (!line.find(field => !!field.tile)) return []
	const lettersInHandRe = getLettersInHandRe(hand)
	if (!lettersInHandRe) return []
	const lineParts = getLineParts(line)
	const reStrings = linePartsToRegExpStrings(lettersInHandRe, lineParts)
	const reStringsTrimmed = linePartsToRegExpStrings(
		lettersInHandRe,
		lineParts,
		{ trim: true },
	)
	const re = new RegExp(reStrings.join('|'))
	const res = reStrings.map(s => new RegExp(s))
	const resTrimmed = reStringsTrimmed.map(s => new RegExp(s, 'g'))
	return words
		.filter(word => re.test(word))
		.filter(word => {
			const wordSlices = getWordSlices(word, res, resTrimmed)
			for (const wordSlice of wordSlices) {
				if (canWordSliceFitIntoLine(wordSlice, lineParts, hand)) {
					return true
				}
			}
			return false
		})
}
