import { Direction } from './Direction'

export interface IWordPlan {
	readonly fieldIndex: number
	readonly direction: Direction
	readonly word: string
	readonly handIndices: number[]
	readonly jokerLetters: (string | null)[]
	readonly score: number
}
