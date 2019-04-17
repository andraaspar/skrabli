import { isUndefinedOrNull } from 'illa/Type'
import { IField } from '../model/Field'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function collectTiles(): TSetStateReducer {
	return ({ board, playerIndex, hands }) => {
		const tiles = board
			.filter(isFieldAffected)
			.map(field => field.tile)
			.map(tile =>
				tile && tile.isJoker ? { ...tile, letter: ' ' } : tile,
			)
		return {
			board: board.map(field =>
				isFieldAffected(field) ? { ...field, tile: null } : field,
			),
			hands: hands.map((hand, handIndex) =>
				handIndex === playerIndex
					? hand.map(tile =>
							isUndefinedOrNull(tile)
								? tiles.shift() || null
								: tile,
					  )
					: hand,
			),
		}
	}
}

function isFieldAffected(field: IField): boolean {
	return !!field.tile && field.tile.isOwned
}
