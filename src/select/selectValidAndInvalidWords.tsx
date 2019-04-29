import { createSelector } from 'reselect'
import { getWordString } from '../fun/getWordString'
import { isWordStringValid } from '../fun/isWordStringValid'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectAllOwnedWords } from './selectAllOwnedWords'

export const selectValidAndInvalidWords = createSelector(
	[selectAllOwnedWords],
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
