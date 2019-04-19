import { createSelector } from 'reselect'
import { getWordScore } from '../fun/getWordScore'
import { IState } from '../model/State'
import { selectValidAndInvalidWords } from './selectValidAndInvalidWords'

export const selectMoveScore = createSelector(
	[selectValidAndInvalidWords],
	(words): number => {
		let score = 0
		for (let word of words.valid) {
			score += getWordScore(word)
		}
		return score
	},
)

export const selectMoveScoreFromState = (s: IState) => selectMoveScore(s.app)
