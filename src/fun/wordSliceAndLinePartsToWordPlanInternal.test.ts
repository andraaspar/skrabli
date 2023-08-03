import { expect, it } from 'vitest'
import { Direction } from '../model/Direction'
import { type IFixedLinePart } from '../model/IFixedLinePart'
import { type ITile } from '../model/ITile'
import { type IWordPlan } from '../model/IWordPlan'
import { withInterface } from './withInterface'
import { wordSliceAndLinePartsToWordPlanInternal } from './wordSliceAndLinePartsToWordPlanInternal'

function makeTile(letter: string) {
	return withInterface<ITile>({
		letter,
		score: 1,
		isOwned: null,
		isJoker: null,
		isLast: null,
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
		wordSliceAndLinePartsToWordPlanInternal({
			lineIndex: 0,
			lineTileIndex: 0,
			direction: Direction.Horizontal,
			wordParts: ['a', 'b', 'cd'],
			lineParts: [1, makeIFixedLinePart('b'), 2],
			hand: [makeTile('a'), makeTile('c'), makeTile('d')],
			boardSize: { width: 4, height: 1 },
		}),
	).toEqual(
		withInterface<IWordPlan>({
			word: 'abcd',
			fieldIndex: 0,
			direction: Direction.Horizontal,
			handIndices: [0, null, 1, 2],
			jokerLetters: [null, null, null, null],
			score: NaN,
			board: [],
			hand: [],
		}),
	)
})

it(`[ryb644]`, () => {
	expect(
		wordSliceAndLinePartsToWordPlanInternal({
			lineIndex: 0,
			lineTileIndex: 0,
			direction: Direction.Horizontal,
			wordParts: ['a', 'b', 'cd'],
			lineParts: [makeIFixedLinePart('a'), 1, makeIFixedLinePart('cd')],
			hand: [makeTile('a'), makeTile('b'), makeTile('c')],
			boardSize: { width: 4, height: 1 },
		}),
	).toEqual(
		withInterface<IWordPlan>({
			word: 'abcd',
			fieldIndex: 0,
			direction: Direction.Horizontal,
			handIndices: [null, 1, null, null],
			jokerLetters: [null, null, null, null],
			score: NaN,
			board: [],
			hand: [],
		}),
	)
})
