import { IState } from '../model/State'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function swapTiles(o: {
	fieldIndexA: number
	fieldIndexB: number
}): TSetStateReducer<IState> {
	return ({ board }) => {
		const fieldIndexA = Math.min(o.fieldIndexA, o.fieldIndexB)
		const fieldIndexB = Math.max(o.fieldIndexA, o.fieldIndexB)
		const fieldA = board[fieldIndexA]
		const fieldB = board[fieldIndexB]
		return {
			fieldIndex: null,
			board: [
				...board.slice(0, fieldIndexA),
				{ ...fieldA, tile: fieldB.tile },
				...board.slice(fieldIndexA + 1, fieldIndexB),
				{ ...fieldB, tile: fieldA.tile },
				...board.slice(fieldIndexB + 1),
			],
		}
	}
}
