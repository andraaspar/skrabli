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

it(`[pr5327]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b', 'cd'],
			[1, 'b', 2],
			[makeTile('a'), makeTile('c'), makeTile('d')],
		),
	).toBe(true)
})
it(`[pr5348]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b'],
			[3, 'b'],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(true)
})
it(`[pr5335]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b'],
			[0, 'b'],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(false)
})
it(`[pr5323]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b', 'a'],
			[1, 'b', 1],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(false)
})
