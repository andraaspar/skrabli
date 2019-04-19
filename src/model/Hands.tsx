import { range } from 'illa/ArrayUtil'
import { ITile } from './Tile'

export type THand = ReadonlyArray<ITile | null>
export type THands = ReadonlyArray<THand>

export function createHands(): THands {
	return range(2).map(_ => range(7).map(_ => null))
}
