import { getPotentialWords } from './fun/getPotentialWords'
import { Direction } from './model/Direction'
import type { IWordPlans } from './model/IWordPlans'
import type { TBoard } from './model/TBoard'
import type { THand } from './model/THand'

self.onmessage = (event) => {
	const { board, hand } = event.data as { board: TBoard; hand: THand }
	const result: IWordPlans = {
		horizontal: getPotentialWords({
			board: board,
			hand: hand,
			direction: Direction.Horizontal,
		}),
		vertical: getPotentialWords({
			board: board,
			hand: hand,
			direction: Direction.Vertical,
		}),
	}
	self.postMessage(result)
}
