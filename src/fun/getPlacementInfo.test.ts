import type { IPlacementInfo } from '@/model/IPlacementInfo'
import { expect, it } from 'vitest'
import { type ITile } from '../model/ITile'
import { getPlacementInfos } from './getPlacementInfos'
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
	expect(
		getPlacementInfos({
			fieldOffset: 0,
			wordParts: [{ gapBefore: 0, fieldCount: 2, text: 'abc' }],
			hand: [makeTile('a'), makeTile('bc')],
		}),
	).toEqual([
		withInterface<IPlacementInfo>({
			fieldOffset: 0,
			handIndices: [0, 1],
			jokerLetters: [null, null],
		}),
	])
})
it(`[prckjm]`, () => {
	expect(
		getPlacementInfos({
			fieldOffset: 0,
			wordParts: [{ gapBefore: 0, fieldCount: 2, text: 'abc' }],
			hand: [makeTile('bc'), makeTile('a')],
		}),
	).toEqual([
		withInterface<IPlacementInfo>({
			fieldOffset: 0,
			handIndices: [1, 0],
			jokerLetters: [null, null],
		}),
	])
})
it(`[prckkc]`, () => {
	expect(
		getPlacementInfos({
			fieldOffset: 0,
			wordParts: [{ gapBefore: 0, fieldCount: 2, text: 'abc' }],
			hand: [makeTile('a'), makeTile('x'), makeTile('bc')],
		}),
	).toEqual([
		withInterface<IPlacementInfo>({
			fieldOffset: 0,
			handIndices: [0, 2],
			jokerLetters: [null, null],
		}),
	])
})
it(`[prckkf]`, () => {
	expect(
		getPlacementInfos({
			fieldOffset: 0,
			wordParts: [{ gapBefore: 0, fieldCount: 2, text: 'abc' }],
			hand: [makeTile('a'), null, makeTile('bc')],
		}),
	).toEqual([
		withInterface<IPlacementInfo>({
			fieldOffset: 0,
			handIndices: [0, 2],
			jokerLetters: [null, null],
		}),
	])
})
it(`[prckkh]`, () => {
	expect(
		getPlacementInfos({
			fieldOffset: 0,
			wordParts: [{ gapBefore: 0, fieldCount: 2, text: 'abc' }],
			hand: [makeTile('d'), null, makeTile('e')],
		}),
	).toEqual([])
})
