import { createSelector } from 'reselect'
import { getWordScore } from '../fun/getWordScore'
import { getWordString } from '../fun/getWordString'
import { isLoaded } from '../fun/isLoaded'
import { BINGO_SCORE } from '../model/Constants'
import { selectAllOwnedWords } from './selectAllOwnedWords'
import { selectIsBingo } from './selectIsBingo'
import { selectWordsValidity } from './simpleSelectors'

export const selectMoveScore = createSelector(
	[selectWordsValidity, selectAllOwnedWords, selectIsBingo],
	(wordsValidity, ownedWords, isBingo): number => {
		let score = 0
		if (isLoaded(wordsValidity)) {
			let hasValidWord = false
			for (let word of ownedWords) {
				if (wordsValidity.loaded.validWords.includes(getWordString(word))) {
					hasValidWord = true
					score += getWordScore(word)
				}
			}
			if (hasValidWord && isBingo) score += BINGO_SCORE
		}
		return score
	},
)
