import { expect, it } from 'vitest'
import { Direction } from '../model/Direction'
import type { IWordPlan } from '../model/IWordPlan'
import { getPotentialWords } from './getPotentialWords'
import { makeBoard } from './test/makeBoard'
import { makeTile } from './test/makeTile'
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
			score: 3,
			handIndices: [0, null, null],
			jokerLetters: [null, null, null],
			word: 'elő',
			board: makeBoard(`
Elő
---
`).board,
			hand: [null, makeTile('l')],
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 0,
			score: 5,
			handIndices: [0, 1],
			jokerLetters: [null, null],
			word: 'el',
			board: makeBoard(`
Elő
L--
`).board,
			hand: [null, null],
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
			score: 3,
			handIndices: [0, null, null],
			jokerLetters: [null, null, null],
			word: 'elő',
			board: makeBoard(`
Elő
--s
--f
apa
`).board,
			hand: [null, makeTile('l')],
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 0,
			score: 5,
			handIndices: [0, 1],
			jokerLetters: [null, null],
			word: 'el',
			board: makeBoard(`
Elő
L-s
--f
apa
`).board,
			hand: [null, null],
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
			score: 6,
			handIndices: [0, 1],
			jokerLetters: [null, null],
			word: 're',
			board: makeBoard(`
űr-
RE-
`).board,
			hand: [null, null, makeTile('á')],
		}),
		withInterface<IWordPlan>({
			direction: Direction.Horizontal,
			fieldIndex: 3,
			score: 7,
			handIndices: [0, 1, 2],
			jokerLetters: [null, null, null],
			word: 'reá',
			board: makeBoard(`
űr-
REÁ
`).board,
			hand: [null, null, null],
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 0,
			score: 2,
			handIndices: [null, 0],
			jokerLetters: [null, null],
			word: 'űr',
			board: makeBoard(`
űr-
R--
`).board,
			hand: [null, makeTile('e'), makeTile('á')],
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 1,
			score: 2,
			handIndices: [null, 1],
			jokerLetters: [null, null],
			word: 're',
			board: makeBoard(`
űr-
-E-
`).board,
			hand: [makeTile('r'), null, makeTile('á')],
		}),
	])
})

it('[rzdybj]', () => {
	const { board, boardSize } = makeBoard(`
-d-
abc
-e-
`)
	expect(
		getPotentialWords({
			board,
			boardSize,
			hand: `f`.split('').map((letter) => makeTile(letter)),
			words: ['abc', 'dbe', 'cf'],
		}),
	).toEqual([])
})
