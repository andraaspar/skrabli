import { IState } from '../model/State'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function swapHands(o: {
	handIndexA: number
	handIndexB: number
}): TSetStateReducer<IState> {
	return ({ hands, playerIndex }) => {
		const hand = hands[playerIndex!]
		const handIndexA = Math.min(o.handIndexA, o.handIndexB)
		const handIndexB = Math.max(o.handIndexA, o.handIndexB)
		const tileA = hand[handIndexA]
		const tileB = hand[handIndexB]
		return {
			handIndex: null,
			hands: [
				...hands.slice(0, playerIndex!),
				[
					...hand.slice(0, handIndexA),
					tileB,
					...hand.slice(handIndexA + 1, handIndexB),
					tileA,
					...hand.slice(handIndexB + 1),
				],
				...hands.slice(playerIndex! + 1),
			],
		}
	}
}
