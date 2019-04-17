import { range } from 'illa/ArrayUtil'
import { ITile } from './Tile'

export type THands = ReadonlyArray<ReadonlyArray<ITile | null>>

export function createHands(): THands {
	return range(2).map(_ => range(7).map(_ => null))
}
