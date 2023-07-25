import { Direction } from '@/model/Direction'
import { FieldKind } from '@/model/FieldKind'
import type { IBoardSize } from '@/model/IBoardSize'
import type { IField } from '@/model/IField'
import type { ITile } from '@/model/ITile'
import type { IWordPlan } from '@/model/IWordPlan'
import type { TBoard } from '@/model/TBoard'
import { expect, it } from 'vitest'
import { getPotentialWords } from './getPotentialWords'
import { withInterface } from './withInterface'

it('[ryb77r]', () => {
	const { board, boardSize } = makeBoard(`
-lő
---
`)
	expect(
		getPotentialWords({
			board,
			boardSize,
			hand: `el`.split('').map((letter) => makeTile(letter)),
			words: ['elő', 'el'],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			direction: Direction.Horizontal,
			fieldIndex: 0,
			score: NaN,
			handIndices: [0, NaN, NaN],
			jokerLetters: [null, null, null],
			word: 'elő',
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 0,
			score: NaN,
			handIndices: [0, 1],
			jokerLetters: [null, null],
			word: 'el',
		}),
	])
})

it('[ryb7rv]', () => {
	const { board, boardSize } = makeBoard(`
-lő
--s
--f
apa
`)
	expect(
		getPotentialWords({
			board,
			boardSize,
			hand: `el`.split('').map((letter) => makeTile(letter)),
			words: ['elő', 'el'],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			direction: Direction.Horizontal,
			fieldIndex: 0,
			score: NaN,
			handIndices: [0, NaN, NaN],
			jokerLetters: [null, null, null],
			word: 'elő',
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 0,
			score: NaN,
			handIndices: [0, 1],
			jokerLetters: [null, null],
			word: 'el',
		}),
	])
})

it('[rycjdi]', () => {
	const { board, boardSize } = makeBoard(`
űr-
---
`)
	expect(
		getPotentialWords({
			board,
			boardSize,
			hand: `reá`.split('').map((letter) => makeTile(letter)),
			words: ['űr', 're', 'reá'],
		}),
	).toEqual([
		withInterface<IWordPlan>({
			direction: Direction.Horizontal,
			fieldIndex: 3,
			score: NaN,
			handIndices: [0, 1],
			jokerLetters: [null, null],
			word: 're',
		}),
		withInterface<IWordPlan>({
			direction: Direction.Horizontal,
			fieldIndex: 3,
			score: NaN,
			handIndices: [0, 1, 2],
			jokerLetters: [null, null, null],
			word: 'reá',
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 0,
			score: NaN,
			handIndices: [NaN, 0],
			jokerLetters: [null, null],
			word: 'űr',
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 1,
			score: NaN,
			handIndices: [NaN, 1],
			jokerLetters: [null, null],
			word: 're',
		}),
	])
})

function makeBoard(s: string) {
	const lines = s.trim().split('\n')
	const boardSize: IBoardSize = {
		height: lines.length,
		width: lines[0].length,
	}
	const board: TBoard = lines
		.join('')
		.split('')
		.map((letter) => makeField(letter === '-' ? null : letter))
	return { boardSize, board }
}

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
