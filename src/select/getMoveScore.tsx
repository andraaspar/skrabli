import { createSelector } from 'reselect'
import { TState } from '../index'
import { getValidAndInvalidWords } from './getValidAndInvalidWords'
import { getWordScore } from './getWordScore'

export const getMoveScore = createSelector(
	[getValidAndInvalidWords],
	(words): number => {
		let score = 0
		for (let word of words.valid) {
			score += getWordScore(word)
		}
		return score
	},
)

export const getMoveScoreFromState = (s: TState) => getMoveScore(s.app)
