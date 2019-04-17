import { isUndefinedOrNull } from 'illa/Type'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { getWordInfo } from './getWordInfo'
import { getWordsAt } from './getWordsAt'
import { isTileOwned } from './isTileOwned'

export function getAllOwnedWords(board: ReadonlyArray<IField>): IField[][] {
	const words: IField[][] = []
	const { firstFieldIndex, lastFieldIndex, direction } = getWordInfo(board)
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
				const { horizontal, vertical } = getWordsAt(board, fieldIndex)
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
}
