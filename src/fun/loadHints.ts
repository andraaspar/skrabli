import HintsWorker from '../hints.worker?worker'
import type { IBoardSize } from '../model/IBoardSize'
import type { IWordPlans } from '../model/IWordPlans'
import type { TBoard } from '../model/TBoard'
import type { THand } from '../model/THand'
import { getKnownWords } from './getKnownWords'

let worker: Worker | null = null

export async function loadHints({
	hand,
	board,
	boardSize,
}: {
	hand: THand
	board: TBoard
	boardSize: IBoardSize
}) {
	try {
		const words = await getKnownWords()
		return await new Promise<IWordPlans>((resolve, reject) => {
			if (worker) worker.terminate()
			worker = new HintsWorker()
			worker.addEventListener('message', (event) => {
				// console.log(`[ryb95u]`, event.data)
				resolve(event.data)
			})
			worker.addEventListener('error', (event) => {
				reject(event.message)
			})
			worker.postMessage({
				hand: hand,
				board: board,
				boardSize: boardSize,
				words: words,
			})
		})
	} finally {
		worker?.terminate()
		worker = null
	}
}
