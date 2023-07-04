import { Direction } from './Direction'

export interface IWordPlan {
	readonly fieldIndex: number
	readonly direction: Direction
	readonly word: string
	readonly tiles: number[]
	readonly score: number
}
