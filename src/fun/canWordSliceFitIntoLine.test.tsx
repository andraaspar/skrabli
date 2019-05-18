import { range } from 'illa/ArrayUtil'
import { withInterface } from 'illa/Type'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { FieldKind } from '../model/FieldKind'
import { IFixedLinePart } from '../model/IFixedLinePart'
import { ITile } from '../model/Tile'
import { IWordPlan } from '../model/WordPlan'
import { canWordSliceFitIntoLine } from './canWordSliceFitIntoLine'

function makeField(letter: string | null) {
	return withInterface<IField>(
		letter
			? {
					kind: FieldKind.Normal,
					tile: makeTile(letter),
			  }
			: {
					kind: FieldKind.Normal,
					tile: null,
			  },
	)
}

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

it(`[prcsfh]`, () => {
	expect(
		canWordSliceFitIntoLine({
			board: [
				...range(5).map(_ => makeField(null)),
				makeField('b'),
				...range(5).map(_ => makeField(null)),
			],
			direction: Direction.Horizontal,
			lineIndex: 0,
			wordSlice: { firstIsFixed: false, wordParts: ['a', 'b'] },
			lineParts: [5, makeIFixedLinePart('b'), 5],
			hand: [makeTile('x'), makeTile('a')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'ab',
			direction: Direction.Horizontal,
			fieldIndex: 4,
			tiles: [1, NaN],
			score: NaN,
		}),
	])
})
