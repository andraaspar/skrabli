import type { IBoardSize } from '@/model/IBoardSize'
import { Direction } from '../model/Direction'
import type { IWordPlan } from '../model/IWordPlan'
import type { TBoard } from '../model/TBoard'
import type { THand } from '../model/THand'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'

export function getPotentialWords(options: {
	words: string[]
	board: TBoard
	boardSize: IBoardSize
	direction: Direction
	hand: THand
}) {
	const wordPlans: IWordPlan[] = []
	for (let lineIndex = 0; lineIndex < options.boardSize.height; lineIndex++) {
		wordPlans.push(
			...getPotentialWordsInLine({
				...options,
				lineIndex,
			}),
		)
	}
	// console.log(wordPlans)
	return wordPlans
}
