import { createSelector } from 'reselect'
import { TState } from '../index'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { getAllOwnedWordsFromAppState } from './getAllOwnedWords'
import { getWordString } from './getWordString'
import { isWordStringValid } from './isWordStringValid'

export const getValidAndInvalidWords = createSelector(
	[getAllOwnedWordsFromAppState],
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

export const getValidAndInvalidWordsFromState = (s: TState) =>
	getValidAndInvalidWords(s.app)
