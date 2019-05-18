import { range } from 'illa/ArrayUtil'
import { withInterface } from 'illa/Type'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { FieldKind } from '../model/FieldKind'
import { ITile } from '../model/Tile'
import { IWordPlan } from '../model/WordPlan'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'

it(`[prckst]`, () => {
	expect(
		getPotentialWordsInLine({
			board: [makeField('t'), makeField(null)],
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'te',
			direction: Direction.Horizontal,
			fieldIndex: 0,
			tiles: [NaN, 0],
			score: NaN,
		}),
	])
})
it(`[prcm7b]`, () => {
	expect(
		getPotentialWordsInLine({
			board: [makeField(null), makeField('t'), makeField(null)],
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'te',
			direction: Direction.Horizontal,
			fieldIndex: 1,
			tiles: [NaN, 0],
			score: NaN,
		}),
	])
})
it(`[prcm7i]`, () => {
	expect(
		getPotentialWordsInLine({
			board: [makeField(null), makeField(null), makeField('t')],
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e'), makeTile('s')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'est',
			direction: Direction.Horizontal,
			fieldIndex: 0,
			tiles: [0, 1, NaN],
			score: NaN,
		}),
	])
})
it(`[preckt]`, () => {
	expect(
		getPotentialWordsInLine({
			board: [
				...range(7).map(() => makeField(null)),
				makeField('l'),
				...range(7).map(() => makeField(null)),
			],
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'el',
			direction: Direction.Horizontal,
			fieldIndex: 6,
			tiles: [0, NaN],
			score: NaN,
		}),
		withInterface<IWordPlan>({
			word: 'le',
			direction: Direction.Horizontal,
			fieldIndex: 7,
			tiles: [NaN, 0],
			score: NaN,
		}),
	])
})

function makeField(letter: string | null) {
	return withInterface<IField>({
		kind: FieldKind.Normal,
		tile: letter ? makeTile(letter) : null,
	})
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
