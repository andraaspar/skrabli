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
		wordSliceAndLinePartsToWordPlanInternal({
			lineIndex: 0,
			lineTileIndex: 0,
			direction: Direction.Horizontal,
			wordParts: ['a', 'b', 'cd'],
			lineParts: [1, makeIFixedLinePart('b'), 2],
			hand: [makeTile('a'), makeTile('c'), makeTile('d')],
		}),
	).toEqual(
		withInterface<IWordPlan>({
			word: 'abcd',
			fieldIndex: 0,
			direction: Direction.Horizontal,
			tiles: [0, NaN, 1, 2],
			score: NaN,
		}),
	)
})
