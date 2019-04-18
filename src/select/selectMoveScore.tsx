import { createSelector } from 'reselect'
import { TState } from '../index'
import { selectValidAndInvalidWords } from './selectValidAndInvalidWords'
import { getWordScore } from '../fun/getWordScore'

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

export const selectMoveScoreFromState = (s: TState) => selectMoveScore(s.app)
