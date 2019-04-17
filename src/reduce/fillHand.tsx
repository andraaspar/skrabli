import { isUndefinedOrNull } from 'illa/Type'
import { IState } from '../model/State'
import { ITile } from '../model/Tile'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function fillHand(): TSetStateReducer<IState> {
	return state => {
		const { bag, hands, playerIndex } = state
		if (isUndefinedOrNull(playerIndex)) throw `[ppt31s]`
		const hand = hands[playerIndex]
		const count = Math.min(
			bag.length,
			hand.reduce((sum, tile) => (tile ? sum : sum + 1), 0),
		)
		const tiles: ITile[] = []
		const newBag = bag.slice()
		for (let i = 0; i < count; i++) {
			tiles.push({
				...newBag.splice(
					Math.floor(Math.random() * newBag.length),
					1,
				)[0],
				isOwned: true,
			})
		}
		const newHand = hand.map(tile => (tile ? tile : tiles.shift() || null))
		return {
			bag: newBag,
			hands: [
				...hands.slice(0, playerIndex),
				newHand,
				...hands.slice(playerIndex + 1),
			],
		}
	}
}
