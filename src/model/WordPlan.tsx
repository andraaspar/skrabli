import { Direction } from './Direction'
import { IFixedLinePart } from './IFixedLinePart'

export interface IWordPlan {
	readonly fieldIndex: number
	readonly direction: Direction
	readonly word: string
	readonly tiles: ReadonlyArray<IFixedLinePart | ReadonlyArray<number>>
	readonly score: number
}
