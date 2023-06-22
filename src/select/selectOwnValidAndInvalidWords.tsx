import { createSelector } from 'reselect'
import { getWordString } from '../fun/getWordString'
import { isLoaded } from '../fun/isLoaded'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectAllOwnedWords } from './selectAllOwnedWords'
import { selectWordsValidity } from './simpleSelectors'

export const selectOwnValidAndInvalidWords = createSelector(
	[selectAllOwnedWords, selectWordsValidity],
	(words: IField[][], wordsValidity): IValidAndInvalidWords | null => {
		if (!isLoaded(wordsValidity)) return null
		const valid: IField[][] = []
		const invalid: IField[][] = []
		for (let word of words) {
			if (wordsValidity.loaded.validWords.includes(getWordString(word))) {
				valid.push(word)
			} else {
				invalid.push(word)
			}
		}
		if (valid.length > 0 || invalid.length > 0) {
			return {
				valid,
				invalid,
			}
		} else {
			return null
		}
	},
)
