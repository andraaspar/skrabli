import { createSelector } from 'reselect'
import { getWordScore } from '../fun/getWordScore'
import { BINGO_SCORE } from '../model/Constants'
import { selectIsBingo } from './selectIsBingo'
import { selectOwnValidAndInvalidWords } from './selectOwnValidAndInvalidWords'

export const selectMoveScore = createSelector(
	[selectOwnValidAndInvalidWords, selectIsBingo],
	(words, isBingo): number => {
		let score = 0
		if (words) {
			for (let word of words.valid) {
				score += getWordScore(word)
			}
			if (words.valid.length && isBingo) score += BINGO_SCORE
		}
		return score
	},
)
