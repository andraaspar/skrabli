import { Direction } from '../model/Direction'
import type { IBoardSize } from '../model/IBoardSize'
import type { IWordInfo } from '../model/IWordInfo'
import type { TBoard } from '../model/TBoard'
import { getColumnIndex } from './getColumnIndex'
import { getRowIndex } from './getRowIndex'
import { getWordAt } from './getWordAt'
import { isThereAGap } from './isThereAGap'

export function getWordInfo(board: TBoard, boardSize: IBoardSize): IWordInfo {
	let firstFieldIndex: number | null = null
	let lastFieldIndex: number | null = null
	let colIndex: number | null = null
	let rowIndex: number | null = null
	let direction: Direction | null = null

	for (let fieldIndex = 0; fieldIndex < board.length; fieldIndex++) {
		const field = board[fieldIndex]!
		if (field.tile && field.tile.isOwned) {
			if (colIndex == null) {
				// First field
				firstFieldIndex = fieldIndex
				lastFieldIndex = fieldIndex
				colIndex = getColumnIndex(fieldIndex, boardSize)
				rowIndex = getRowIndex(fieldIndex, boardSize)
			} else {
				const newColIndex = getColumnIndex(fieldIndex, boardSize)
				const newRowIndex = getRowIndex(fieldIndex, boardSize)
				if (lastFieldIndex === firstFieldIndex) {
					// Second field
					if (colIndex === newColIndex) {
						direction = Direction.Vertical
					} else if (rowIndex === newRowIndex) {
						direction = Direction.Horizontal
					}
				} else {
					// Third+ field
					if (
						(direction === Direction.Vertical && colIndex !== newColIndex) ||
						(direction === Direction.Horizontal && rowIndex !== newRowIndex)
					) {
						direction = null
					}
				}
				colIndex = newColIndex
				rowIndex = newRowIndex
				lastFieldIndex = fieldIndex
			}
		}
	}
	if (firstFieldIndex != null) {
		const horizontal = getWordAt(
			board,
			boardSize,
			firstFieldIndex,
			Direction.Horizontal,
		)
		const vertical = getWordAt(
			board,
			boardSize,
			firstFieldIndex,
			Direction.Vertical,
		)
		if (firstFieldIndex === lastFieldIndex) {
			if (horizontal.word.length) {
				direction = Direction.Horizontal
			} else if (vertical.word.length) {
				direction = Direction.Vertical
			}
		}
		if (direction === Direction.Horizontal) {
			firstFieldIndex = Math.min(
				firstFieldIndex,
				getRowIndex(firstFieldIndex, boardSize) * boardSize.width +
					horizontal.startLineIndex,
			)
			lastFieldIndex = Math.max(
				lastFieldIndex!,
				getRowIndex(firstFieldIndex, boardSize) * boardSize.width +
					horizontal.endLineIndex,
			)
		} else if (direction === Direction.Vertical) {
			firstFieldIndex = Math.min(
				firstFieldIndex,
				vertical.startLineIndex * boardSize.width +
					getColumnIndex(firstFieldIndex, boardSize),
			)
			lastFieldIndex = Math.max(
				lastFieldIndex!,
				vertical.endLineIndex * boardSize.width +
					getColumnIndex(firstFieldIndex, boardSize),
			)
		}
	}
	if (
		firstFieldIndex != null &&
		lastFieldIndex != null &&
		direction != null &&
		isThereAGap(board, boardSize, firstFieldIndex, lastFieldIndex, direction)
	) {
		direction = null
	}
	return {
		firstFieldIndex,
		lastFieldIndex,
		direction,
	}
}
