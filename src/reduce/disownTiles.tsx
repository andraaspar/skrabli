import { TSetStateReducer } from '../model/TSetStateReducer'

export function disownTiles(): TSetStateReducer {
	return ({ board }) => ({
		board: board.map(field =>
			field.tile && field.tile.isOwned
				? { ...field, tile: { ...field.tile, isOwned: false } }
				: field,
		),
	})
}
