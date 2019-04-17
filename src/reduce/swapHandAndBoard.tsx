import { TSetStateReducer } from '../model/TSetStateReducer'

export function swapHandAndBoard({
	handIndex,
	fieldIndex,
}: {
	handIndex: number
	fieldIndex: number
}): TSetStateReducer {
	return ({ board, hands, playerIndex }) => {
		const field = board[fieldIndex]
		const hand = hands[playerIndex!]
		const tileOnBoard = field.tile
		const tileInHand = hand[handIndex]
		return {
			fieldIndex: null,
			handIndex: null,
			board: board.map((field, aFieldIndex) =>
				aFieldIndex === fieldIndex
					? { ...field, tile: tileInHand }
					: field,
			),
			hands: hands.map((hand, aPlayerIndex) =>
				playerIndex === aPlayerIndex
					? hand.map((tile, aHandIndex) =>
							aHandIndex === handIndex
								? tileOnBoard && tileOnBoard.isJoker
									? { ...tileOnBoard, letter: ' ' }
									: tileOnBoard
								: tile,
					  )
					: hand,
			),
		}
	}
}
