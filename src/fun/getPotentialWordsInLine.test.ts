import { expect, it } from 'vitest'
import { Direction } from '../model/Direction'
import { FieldKind } from '../model/FieldKind'
import { type IField } from '../model/IField'
import { type ITile } from '../model/ITile'
import { type IWordPlan } from '../model/IWordPlan'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'
import { range } from './range'
import { withInterface } from './withInterface'

it(`[prckst]`, () => {
	expect(
		getPotentialWordsInLine({
			words: ['én', 'te', 'ő'],
			board: [makeField('t'), makeField(null)],
			boardSize: { width: 2, height: 1 },
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'te',
			direction: Direction.Horizontal,
			fieldIndex: 0,
			handIndices: [NaN, 0],
			jokerLetters: [null, null],
			score: NaN,
		}),
	])
})
it(`[prcm7b]`, () => {
	expect(
		getPotentialWordsInLine({
			words: ['én', 'te', 'ő'],
			board: [makeField(null), makeField('t'), makeField(null)],
			boardSize: { width: 3, height: 1 },
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'te',
			direction: Direction.Horizontal,
			fieldIndex: 1,
			handIndices: [NaN, 0],
			jokerLetters: [null, null],
			score: NaN,
		}),
	])
})
it(`[prcm7i]`, () => {
	expect(
		getPotentialWordsInLine({
			words: ['reggel', 'dél', 'est'],
			board: [makeField(null), makeField(null), makeField('t')],
			boardSize: { width: 3, height: 1 },
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e'), makeTile('s')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'est',
			direction: Direction.Horizontal,
			fieldIndex: 0,
			handIndices: [0, 1, NaN],
			jokerLetters: [null, null, null],
			score: NaN,
		}),
	])
})
it(`[preckt]`, () => {
	expect(
		getPotentialWordsInLine({
			words: ['el', 'le', 'ell', 'lle', 'lel'],
			board: [
				...range(7).map(() => makeField(null)),
				makeField('l'),
				...range(7).map(() => makeField(null)),
			],
			boardSize: { width: 15, height: 1 },
			lineIndex: 0,
			direction: Direction.Horizontal,
			hand: [makeTile('e')],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'el',
			direction: Direction.Horizontal,
			fieldIndex: 6,
			handIndices: [0, NaN],
			jokerLetters: [null, null],
			score: NaN,
		}),
		withInterface<IWordPlan>({
			word: 'le',
			direction: Direction.Horizontal,
			fieldIndex: 7,
			handIndices: [NaN, 0],
			jokerLetters: [null, null],
			score: NaN,
		}),
	])
})
it(`[ry1jh1]`, () => {
	expect(
		getPotentialWordsInLine({
			words: ['ló', 'ól'],
			board: [
				...range(8).map(() => makeField(null)),
				makeField('l'),
				makeField(null),
				makeField('ó'),
				...range(4).map(() => makeField(null)),
			],
			boardSize: { width: 1, height: 15 },
			lineIndex: 0,
			direction: Direction.Vertical,
			hand: 'rámlóge'.split('').map((letter) => makeTile(letter)),
		}),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'ól',
			direction: Direction.Vertical,
			fieldIndex: 7,
			handIndices: [4, NaN],
			jokerLetters: [null, null],
			score: NaN,
		}),
		withInterface<IWordPlan>({
			word: 'ól',
			direction: Direction.Vertical,
			fieldIndex: 10,
			handIndices: [NaN, 3],
			jokerLetters: [null, null],
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
