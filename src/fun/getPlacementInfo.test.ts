import type { IPlacementInfo } from '@/model/IPlacementInfo'
import { expect, it } from 'vitest'
import { type ITile } from '../model/ITile'
import { getPlacementInfo } from './getPlacementInfo'
import { withInterface } from './withInterface'

function makeTile(letter: string) {
	return withInterface<ITile>({
		letter,
		score: 1,
		isOwned: null,
		isJoker: null,
		isLast: null,
	})
}

it(`[prckj2]`, () => {
	expect(getPlacementInfo('abc', [makeTile('a'), makeTile('bc')])).toEqual(
		withInterface<IPlacementInfo>({
			handIndices: [0, 1],
			jokerLetters: [null, null],
		}),
	)
})
it(`[prckjm]`, () => {
	expect(getPlacementInfo('abc', [makeTile('bc'), makeTile('a')])).toEqual(
		withInterface<IPlacementInfo>({
			handIndices: [1, 0],
			jokerLetters: [null, null],
		}),
	)
})
it(`[prckkc]`, () => {
	expect(
		getPlacementInfo('abc', [makeTile('a'), makeTile('x'), makeTile('bc')]),
	).toEqual(
		withInterface<IPlacementInfo>({
			handIndices: [0, 2],
			jokerLetters: [null, null],
		}),
	)
})
it(`[prckkf]`, () => {
	expect(
		getPlacementInfo('abc', [makeTile('a'), null, makeTile('bc')]),
	).toEqual(
		withInterface<IPlacementInfo>({
			handIndices: [0, 2],
			jokerLetters: [null, null],
		}),
	)
})
it(`[prckkh]`, () => {
	expect(() => {
		getPlacementInfo('abc', [makeTile('d'), null, makeTile('e')])
	}).toThrow('[pr8z2l]')
})
