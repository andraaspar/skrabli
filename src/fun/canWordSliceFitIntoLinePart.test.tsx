import { withInterface } from 'illa/Type'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { FieldKind } from '../model/FieldKind'
import { IFixedLinePart } from '../model/IFixedLinePart'
import { ITile } from '../model/Tile'
import { IWordPlan } from '../model/WordPlan'
import { canWordSliceFitIntoLinePart } from './canWordSliceFitIntoLinePart'

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

it(`[pr5327]`, () => {
	expect(
		canWordSliceFitIntoLinePart({
			board: [
				makeField(null),
				makeField('b'),
				makeField(null),
				makeField(null),
			],
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
