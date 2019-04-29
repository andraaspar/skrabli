import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { getFieldIndexOffset } from '../fun/getNextFieldIndex'
import { getWordsAt } from '../fun/getWordsAt'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { selectWordInfo } from './selectWordInfo'
import { selectBoard } from './simpleSelectors'

export const selectAllOwnedWords = createSelector(
	[selectBoard, selectWordInfo],
	(board, { firstFieldIndex, lastFieldIndex, direction }): IField[][] => {
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
					if (direction === Direction.Horizontal) {
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
