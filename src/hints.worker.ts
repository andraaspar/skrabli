import { getPotentialWords } from './fun/getPotentialWords'
import { Direction } from './model/Direction'
import type { IWordPlans } from './model/IWordPlans'
import type { TBoard } from './model/TBoard'
import type { THand } from './model/THand'

self.onmessage = async (event) => {
	const { board, hand, words } = event.data as {
		board: TBoard
		hand: THand
		words: string[]
	}
	const result: IWordPlans = {
		horizontal: getPotentialWords({
			words: words,
			board: board,
			hand: hand,
			direction: Direction.Horizontal,
		}),
		vertical: getPotentialWords({
			words: words,
			board: board,
			hand: hand,
			direction: Direction.Vertical,
		}),
	}
	self.postMessage(result)
}
