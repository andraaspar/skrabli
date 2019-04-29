import { isUndefinedOrNull } from 'illa/Type'
import { defaultMemoize } from 'reselect'
import { getColumnIndex } from '../fun/getColumnIndex'
import { getRowIndex } from '../fun/getRowIndex'
import { getWordsAt } from '../fun/getWordsAt'
import { isThereAGap } from '../fun/isThereAGap'
import { IAppState } from '../model/AppState'
import { TBoard } from '../model/Board'
import { BOARD_SIZE } from '../model/Constants'
import { Direction } from '../model/Direction'

export interface IWordInfo {
	firstFieldIndex: number | null
	lastFieldIndex: number | null
	direction: Direction | null
}

export const selectWordInfo = defaultMemoize(
	(board: TBoard): IWordInfo => {
		let firstFieldIndex: number | null = null
		let lastFieldIndex: number | null = null
		let colIndex: number | null = null
		let rowIndex: number | null = null
		let direction: Direction | null = null

		for (let fieldIndex = 0; fieldIndex < board.length; fieldIndex++) {
			const field = board[fieldIndex]
			if (field.tile && field.tile.isOwned) {
				if (isUndefinedOrNull(colIndex)) {
					// First field
					firstFieldIndex = fieldIndex
					lastFieldIndex = fieldIndex
					colIndex = getColumnIndex(fieldIndex)
					rowIndex = getRowIndex(fieldIndex)
				} else {
					const newColIndex = getColumnIndex(fieldIndex)
					const newRowIndex = getRowIndex(fieldIndex)
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
							(direction === Direction.Vertical &&
								colIndex !== newColIndex) ||
							(direction === Direction.Horizontal &&
								rowIndex !== newRowIndex)
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
		if (!isUndefinedOrNull(firstFieldIndex)) {
			const { horizontal, vertical } = getWordsAt(board, firstFieldIndex)
			if (firstFieldIndex === lastFieldIndex) {
				if (horizontal.word.length) {
					direction = Direction.Horizontal
				} else if (vertical.word.length) {
					direction = Direction.Vertical
				}
			}
			if (direction === Direction.Horizontal) {
				firstFieldIndex =
					getRowIndex(firstFieldIndex) * BOARD_SIZE +
					horizontal.startLineIndex
				lastFieldIndex =
					getRowIndex(firstFieldIndex) * BOARD_SIZE +
					horizontal.endLineIndex
			} else if (direction === Direction.Vertical) {
				firstFieldIndex =
					vertical.startLineIndex * BOARD_SIZE +
					getColumnIndex(firstFieldIndex)
				lastFieldIndex =
					vertical.endLineIndex * BOARD_SIZE +
					getColumnIndex(firstFieldIndex)
			}
		}
		if (
			!isUndefinedOrNull(firstFieldIndex) &&
			!isUndefinedOrNull(lastFieldIndex) &&
			!isUndefinedOrNull(direction) &&
			isThereAGap(board, firstFieldIndex, lastFieldIndex, direction)
		) {
			direction = null
		}
		return {
			firstFieldIndex,
			lastFieldIndex,
			direction,
		}
	},
)

export const selectWordInfoFromAppState = (state: IAppState) =>
	selectWordInfo(state.board)
export const selectWordInfoFromState = (state: IAppState) =>
	selectWordInfoFromAppState(state)
