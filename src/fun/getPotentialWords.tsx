import { TBoard } from '../model/Board'
import { BOARD_SIZE } from '../model/Constants'
import { Direction } from '../model/Direction'
import { THand } from '../model/Hands'
import { IWordPlan } from '../model/WordPlan'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'

export function getPotentialWords(options: {
	board: TBoard
	direction: Direction
	hand: THand
}) {
	let wordPlans: IWordPlan[] = []
	for (let lineIndex = 0; lineIndex < BOARD_SIZE; lineIndex++) {
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
