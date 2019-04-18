import { range } from 'illa/ArrayUtil'
import { withInterface } from 'illa/Type'
import letters from '../res/letters.json'
import { ITile } from './Tile'

export type TBag = ReadonlyArray<ITile>

export function createBag(): TBag {
	return letters.flatMap(({ count, letter, score }) =>
		range(count).map(_ =>
			withInterface<ITile>({
				letter,
				score,
				isOwned: false,
				isJoker: letter === ' ',
			}),
		),
	)
}
