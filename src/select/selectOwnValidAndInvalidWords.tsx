import { createSelector } from 'reselect'
import { getWordString } from '../fun/getWordString'
import { isWordStringValid } from '../fun/isWordStringValid'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectAllOwnedWords } from './selectAllOwnedWords'

export const selectOwnValidAndInvalidWords = createSelector(
	[selectAllOwnedWords],
	(words: IField[][]): IValidAndInvalidWords | null => {
		const valid: IField[][] = []
		const invalid: IField[][] = []
		for (let word of words) {
			if (isWordStringValid(getWordString(word))) {
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
