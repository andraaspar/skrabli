import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { getFieldIndexOffset } from '../fun/getNextFieldIndex'
import { getWordAt } from '../fun/getWordAt'
import { theOtherDirection } from '../fun/theOtherDirection'
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
					if (!mainWord) {
						mainWord = getWordAt(board, fieldIndex, direction).word
					}
					words.push(
						getWordAt(
							board,
							fieldIndex,
							theOtherDirection(direction),
						).word,
					)
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
