import { createSelector } from 'reselect'
import { getWordScore } from '../fun/getWordScore'
import { BINGO_SCORE } from '../model/Constants'
import { selectIsBingo } from './selectIsBingo'
import { selectValidAndInvalidWords } from './selectValidAndInvalidWords'

export const selectMoveScore = createSelector(
	[selectValidAndInvalidWords, selectIsBingo],
	(words, isBingo): number => {
		let score = 0
		for (let word of words.valid) {
			score += getWordScore(word)
		}
		if (words.valid.length && isBingo) score += BINGO_SCORE
		return score
	},
)
