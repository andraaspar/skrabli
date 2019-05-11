import { withInterface } from 'illa/Type'
import { IFixedLinePart } from '../model/IFixedLinePart'
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

function makeIFixedLinePart(text: string): IFixedLinePart {
	return {
		text,
		fieldCount: text.length,
	}
}

it(`[pr5327]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b', 'cd'],
			[1, makeIFixedLinePart('b'), 2],
			[makeTile('a'), makeTile('c'), makeTile('d')],
		),
	).toBe(true)
})
it(`[pr5348]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b'],
			[3, makeIFixedLinePart('b')],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(true)
})
it(`[pr5335]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b'],
			[0, makeIFixedLinePart('b')],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(false)
})
it(`[pr5323]`, () => {
	expect(
		canWordSliceFitIntoLinePart(
			['a', 'b', 'a'],
			[1, makeIFixedLinePart('b'), 1],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(false)
})
