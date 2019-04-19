import { isUndefinedOrNull } from 'illa/Type'
import { defaultMemoize } from 'reselect'
import { getFieldIndexOffset } from '../fun/getNextFieldIndex'
import { getWordsAt } from '../fun/getWordsAt'
import { IAppState } from '../model/AppState'
import { TBoard } from '../model/Board'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { IState } from '../model/State'
import { selectWordInfo } from './selectWordInfo'

export const selectAllOwnedWords = defaultMemoize(
	(board: TBoard): IField[][] => {
		const { firstFieldIndex, lastFieldIndex, direction } = selectWordInfo(
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
				if (field.tile.isOwned) {
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

export const selectAllOwnedWordsFromAppState = (s: IAppState) =>
	selectAllOwnedWords(s.board)
export const selectAllOwnedWordsFromState = (s: IState) =>
	selectAllOwnedWordsFromAppState(s.app)
