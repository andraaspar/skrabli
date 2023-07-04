import { expect, it } from 'vitest'
import { type ITile } from '../model/ITile'
import { getHandIndicesForWord } from './getHandIndicesForWord'
import { withInterface } from './withInterface'

function makeTile(letter: string) {
	return withInterface<ITile>({
		letter,
		score: 1,
		isOwned: undefined,
		isJoker: undefined,
		isLast: undefined,
	})
}

it(`[prckj2]`, () => {
	expect(getHandIndicesForWord('abc', [makeTile('a'), makeTile('bc')])).toEqual(
		[0, 1],
	)
})
it(`[prckjm]`, () => {
	expect(getHandIndicesForWord('abc', [makeTile('bc'), makeTile('a')])).toEqual(
		[1, 0],
	)
})
it(`[prckkc]`, () => {
	expect(
		getHandIndicesForWord('abc', [
			makeTile('a'),
			makeTile('x'),
			makeTile('bc'),
		]),
	).toEqual([0, 2])
})
it(`[prckkf]`, () => {
	expect(
		getHandIndicesForWord('abc', [makeTile('a'), null, makeTile('bc')]),
	).toEqual([0, 2])
})
it(`[prckkh]`, () => {
	expect(() => {
		getHandIndicesForWord('abc', [makeTile('d'), null, makeTile('e')])
	}).toThrow('[pr8z2l]')
})
