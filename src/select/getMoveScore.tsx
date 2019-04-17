import { IField } from '../model/Field'
import { getValidAndInvalidWords } from './getValidAndInvalidWords'
import { getWordScore } from './getWordScore'

export function getMoveScore(board: ReadonlyArray<IField>): number {
	let score = 0
	for (let word of getValidAndInvalidWords(board).valid) {
		score += getWordScore(word)
	}
	return score
}
