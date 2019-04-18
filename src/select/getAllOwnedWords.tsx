import { isUndefinedOrNull } from 'illa/Type'
import { defaultMemoize } from 'reselect'
import { TState } from '../index'
import { IAppState } from '../model/AppState'
import { TBoard } from '../model/Board'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { getWordInfo } from './getWordInfo'
import { getWordsAt } from './getWordsAt'
import { isTileOwned } from './isTileOwned'

export const getAllOwnedWords = defaultMemoize(
	(board: TBoard): IField[][] => {
		const { firstFieldIndex, lastFieldIndex, direction } = getWordInfo(
			board,
		)
		const words: IField[][] = []
		let mainWord: IField[] | null = null
		if (
			!isUndefinedOrNull(firstFieldIndex) &&
			!isUndefinedOrNull(lastFieldIndex) &&
			!isUndefinedOrNull(direction)
		) {
			let fieldIndex = firstFieldIndex
			let field = board[fieldIndex]
			while (field && field.tile) {
				if (isTileOwned(field.tile)) {
					const { horizontal, vertical } = getWordsAt(
						board,
						fieldIndex,
					)
					if (direction == Direction.Horizontal) {
						words.push(vertical.word)
						if (mainWord) {
							// words.push(word.horizontal)
						} else {
							mainWord = horizontal.word
						}
					} else {
						words.push(horizontal.word)
						if (mainWord) {
							// words.push(word.vertical)
						} else {
							mainWord = vertical.word
						}
					}
				}
				fieldIndex += getFieldIndexOffset(direction)
				if (fieldIndex > lastFieldIndex) break
				field = board[fieldIndex]
			}
		}
		if (mainWord) words.push(mainWord)
		return words.filter(_ => _.length > 0)
	},
)

export const getAllOwnedWordsFromAppState = (s: IAppState) =>
	getAllOwnedWords(s.board)
export const getAllOwnedWordsFromState = (s: TState) =>
	getAllOwnedWordsFromAppState(s.app)
