import { TSetStateReducer } from '../model/TSetStateReducer'

export function setJokerLetter(letter: string): TSetStateReducer {
	return ({ board, fieldIndex }) => {
		if (!fieldIndex) return {}
		const field = board[fieldIndex]
		const tile = field.tile
		if (!tile) return {}
		return {
			fieldIndex: null,
			board: [
				...board.slice(0, fieldIndex),
				{ ...field, tile: { ...tile, letter } },
				...board.slice(fieldIndex + 1),
			],
		}
	}
}
