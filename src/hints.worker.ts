import { getPotentialWords } from './fun/getPotentialWords'
import { Direction } from './model/Direction'
import type { IBoardSize } from './model/IBoardSize'
import type { IWordPlans } from './model/IWordPlans'
import type { TBoard } from './model/TBoard'
import type { THand } from './model/THand'

self.addEventListener('unhandledrejection', (event) => {
	throw event.reason
})

self.onmessage = async (event) => {
	const { board, boardSize, hand, words } = event.data as {
		board: TBoard
		boardSize: IBoardSize
		hand: THand
		words: string[]
	}
	const result: IWordPlans = {
		horizontal: getPotentialWords({
			words: words,
			board: board,
			boardSize: boardSize,
			hand: hand,
			direction: Direction.Horizontal,
		}),
		vertical: getPotentialWords({
			words: words,
			board: board,
			boardSize: boardSize,
			hand: hand,
			direction: Direction.Vertical,
		}),
	}
	self.postMessage(result)
}
