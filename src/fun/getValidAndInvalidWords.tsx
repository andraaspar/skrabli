import memoizee from 'memoizee'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { getAllOwnedWords } from './getAllOwnedWords'
import { getWordString } from './getWordString'
import { isWordStringValid } from './isWordStringValid'

export const getValidAndInvalidWords = memoizee(
	(board: ReadonlyArray<IField>): IValidAndInvalidWords => {
		const words = getAllOwnedWords(board)
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
	{ max: 1 },
)
