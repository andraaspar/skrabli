import { createSelector } from 'reselect'
import { getWordScore } from '../fun/getWordScore'
import { BINGO_SCORE } from '../model/Constants'
import { IState } from '../model/State'
import { selectIsBingoFromAppState } from './selectIsBingo'
import { selectValidAndInvalidWordsFromAppState } from './selectValidAndInvalidWords'

export const selectMoveScoreFromAppState = createSelector(
	[selectValidAndInvalidWordsFromAppState, selectIsBingoFromAppState],
	(words, isBingo): number => {
		let score = 0
		for (let word of words.valid) {
			score += getWordScore(word)
		}
		if (words.valid.length && isBingo) score += BINGO_SCORE
		return score
	},
)

export const selectMoveScoreFromState = (s: IState) =>
	selectMoveScoreFromAppState(s.app)
