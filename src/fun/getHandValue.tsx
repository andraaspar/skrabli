import memoizee from 'memoizee'
import { THand } from '../model/Hands'

export const getHandValue = memoizee(
	(hand: THand) => {
		return hand.reduce((sum, tile) => sum + (tile ? tile.score : 0), 0)
	},
	{ max: 2 },
)
