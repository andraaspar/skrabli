import { expect, it } from 'vitest'
import { Direction } from '../model/Direction'
import { type IFixedLinePart } from '../model/IFixedLinePart'
import { type ITile } from '../model/ITile'
import { type IWordPlan } from '../model/IWordPlan'
import { withInterface } from './withInterface'
import { wordSliceAndLinePartsToWordPlan } from './wordSliceAndLinePartsToWordPlan'

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

it(`[prcsfh]`, () => {
	expect(
		wordSliceAndLinePartsToWordPlan({
			direction: Direction.Horizontal,
			lineIndex: 0,
			wordSlice: { firstIsFixed: false, wordParts: ['a', 'b'] },
			lineParts: [5, makeIFixedLinePart('b'), 5],
			hand: [makeTile('x'), makeTile('a')],
			boardSize: { width: 2, height: 1 },
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'ab',
			direction: Direction.Horizontal,
			fieldIndex: 4,
			handIndices: [1, null],
			jokerLetters: [null, null],
			score: NaN,
			board: [],
			hand: [],
		}),
	])
})
