import { isUndefinedOrNull } from 'illa/Type'
import { TBoard } from '../model/Board'
import { IField } from '../model/Field'
import { IWordInfo } from '../model/IWordInfo'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { getWordAt } from './getWordAt'
import { theOtherDirection } from './theOtherDirection'

export function getAllOwnedWords(
	board: TBoard,
	{ firstFieldIndex, lastFieldIndex, direction }: IWordInfo,
): IField[][] {
	const words: IField[][] = []
	if (
		!isUndefinedOrNull(firstFieldIndex) &&
		!isUndefinedOrNull(lastFieldIndex) &&
		!isUndefinedOrNull(direction)
	) {
		words.push(getWordAt(board, firstFieldIndex, direction).word)
		let fieldIndex = firstFieldIndex
		let field = board[fieldIndex]
		while (field && field.tile) {
			if (field.tile.isOwned) {
				words.push(
					getWordAt(board, fieldIndex, theOtherDirection(direction))
						.word,
				)
			}
			fieldIndex += getFieldIndexOffset(direction)
			if (fieldIndex > lastFieldIndex) break
			field = board[fieldIndex]
		}
	}
	return words.filter(_ => _.length > 0)
}
