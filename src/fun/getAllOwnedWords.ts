import type { IBoardSize } from '@/model/IBoardSize'
import { type IField } from '../model/IField'
import { type IWordInfo } from '../model/IWordInfo'
import { type TBoard } from '../model/TBoard'
import { getFieldIndexOffset } from './getNextFieldIndex'
import { getWordAt } from './getWordAt'
import { theOtherDirection } from './theOtherDirection'

export function getAllOwnedWords(
	board: TBoard,
	boardSize: IBoardSize,
	{ firstFieldIndex, lastFieldIndex, direction }: IWordInfo,
): IField[][] {
	const words: IField[][] = []
	if (firstFieldIndex != null && lastFieldIndex != null && direction != null) {
		words.push(getWordAt(board, boardSize, firstFieldIndex, direction).word)
		let fieldIndex = firstFieldIndex
		let field = board[fieldIndex]
		while (field && field.tile) {
			if (field.tile.isOwned) {
				words.push(
					getWordAt(board, boardSize, fieldIndex, theOtherDirection(direction))
						.word,
				)
			}
			fieldIndex += getFieldIndexOffset(direction, boardSize)
			if (fieldIndex > lastFieldIndex) break
			field = board[fieldIndex]
		}
	}
	return words.filter((_) => _.length > 0)
}
