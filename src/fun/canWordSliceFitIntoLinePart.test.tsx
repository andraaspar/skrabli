import { withInterface } from 'illa/Type'
import { ITile } from '../model/Tile'
import { canWordSliceFitIntoLinePart } from './canWordSliceFitIntoLinePart'

function makeTile(letter: string) {
	return withInterface<ITile>({
		letter,
		score: 1,
		isOwned: undefined,
		isJoker: undefined,
		isLast: undefined,
	})
}

it(`works`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b', 'cd'],
			[1, 'b', 2],
			[makeTile('a'), makeTile('c'), makeTile('d')],
		),
	).toBe(true)
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b'],
			[3, 'b'],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(true)
})
