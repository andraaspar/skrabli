import { BINGO_SCORE } from '../model/Constants'
import type { IField } from '../model/IField'
import { getWordScore } from './getWordScore'

export function getMoveScore(allOwnedWords: IField[][], isBingo: boolean) {
	let score = 0
	for (const word of allOwnedWords) {
		score += getWordScore(word)
	}
	if (isBingo) score += BINGO_SCORE
	return score
}
