import { Direction } from './Direction'
import type { TBoard } from './TBoard'
import type { THand } from './THand'

export interface IWordPlan {
	fieldIndex: number
	direction: Direction
	word: string
	handIndices: (number | null)[]
	jokerLetters: (string | null)[]
	score: number
	board: TBoard
	hand: THand
}
