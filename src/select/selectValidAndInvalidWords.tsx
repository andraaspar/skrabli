import { createSelector } from 'reselect'
import { getWordString } from '../fun/getWordString'
import { isWordStringValid } from '../fun/isWordStringValid'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { IState } from '../model/State'
import { selectAllOwnedWordsFromAppState } from './selectAllOwnedWords'

export const selectValidAndInvalidWords = createSelector(
	[selectAllOwnedWordsFromAppState],
	(words: IField[][]): IValidAndInvalidWords => {
		const valid: IField[][] = []
		const invalid: IField[][] = []
		for (let word of words) {
			if (isWordStringValid(getWordString(word))) {
				valid.push(word)
			} else {
				invalid.push(word)
			}
		}
		return {
			valid,
			invalid,
		}
	},
)

export const selectValidAndInvalidWordsFromState = (s: IState) =>
	selectValidAndInvalidWords(s.app)
