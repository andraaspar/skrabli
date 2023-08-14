import { expect, it } from 'vitest'
import { Direction } from '../model/Direction'
import { type IWordPlan } from '../model/IWordPlan'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'
import { makeBoard } from './test/makeBoard'
import { makeTile } from './test/makeTile'
import { withInterface } from './withInterface'

it(`[prckst]`, () => {
	const { board, boardSize } = makeBoard(`t-`)
	expect(
		Array.from(
			getPotentialWordsInLine({
				words: ['én', 'te', 'ő'],
				board,
				boardSize,
				lineIndex: 0,
				direction: Direction.Horizontal,
				hand: [makeTile('e')],
			}).values(),
		),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'te',
			direction: Direction.Horizontal,
			fieldIndex: 0,
			handIndices: [null, 0],
			jokerLetters: [null, null],
			score: 2,
			board: makeBoard(`tE`).board,
			hand: [null],
		}),
	])
})
it(`[prcm7b]`, () => {
	const { board, boardSize } = makeBoard(`-t-`)
	expect(
		Array.from(
			getPotentialWordsInLine({
				words: ['én', 'te', 'ő'],
				board,
				boardSize,
				lineIndex: 0,
				direction: Direction.Horizontal,
				hand: [makeTile('e')],
			}).values(),
		),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'te',
			direction: Direction.Horizontal,
			fieldIndex: 1,
			handIndices: [null, 0],
			jokerLetters: [null, null],
			score: 2,
			board: makeBoard(`-tE`).board,
			hand: [null],
		}),
	])
})
it(`[prcm7i]`, () => {
	const { board, boardSize } = makeBoard(`--t`)
	expect(
		Array.from(
			getPotentialWordsInLine({
				words: ['reggel', 'dél', 'est'],
				board,
				boardSize,
				lineIndex: 0,
				direction: Direction.Horizontal,
				hand: [makeTile('e'), makeTile('s')],
			}).values(),
		),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'est',
			direction: Direction.Horizontal,
			fieldIndex: 0,
			handIndices: [0, 1, null],
			jokerLetters: [null, null, null],
			score: 3,
			board: makeBoard(`ESt`).board,
			hand: [null, null],
		}),
	])
})
it(`[preckt]`, () => {
	const { board, boardSize } = makeBoard(`---l---`)
	expect(
		Array.from(
			getPotentialWordsInLine({
				words: ['el', 'le', 'ell', 'lle', 'lel'],
				board,
				boardSize,
				lineIndex: 0,
				direction: Direction.Horizontal,
				hand: [makeTile('e')],
			}).values(),
		),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'el',
			direction: Direction.Horizontal,
			fieldIndex: 2,
			handIndices: [0, null],
			jokerLetters: [null, null],
			score: 2,
			board: makeBoard(`--El---`).board,
			hand: [null],
		}),
		withInterface<IWordPlan>({
			word: 'le',
			direction: Direction.Horizontal,
			fieldIndex: 3,
			handIndices: [null, 0],
			jokerLetters: [null, null],
			score: 2,
			board: makeBoard(`---lE--`).board,
			hand: [null],
		}),
	])
})
it(`[ry1jh1]`, () => {
	const { board, boardSize } = makeBoard(`---l-ó---`)
	expect(
		Array.from(
			getPotentialWordsInLine({
				words: ['ló', 'ól'],
				board,
				boardSize,
				lineIndex: 0,
				direction: Direction.Horizontal,
				hand: 'rámlóge'.split('').map((letter) => makeTile(letter)),
			}).values(),
		),
	).toEqual([
		withInterface<IWordPlan>({
			word: 'ól',
			direction: Direction.Horizontal,
			fieldIndex: 2,
			handIndices: [4, null],
			jokerLetters: [null, null],
			score: 2,
			board: makeBoard(`--Ól-ó---`).board,
			hand: 'ráml-ge'.split('').map((letter) => makeTile(letter)),
		}),
		withInterface<IWordPlan>({
			word: 'ól',
			direction: Direction.Horizontal,
			fieldIndex: 5,
			handIndices: [null, 3],
			jokerLetters: [null, null],
			score: 2,
			board: makeBoard(`---l-óL--`).board,
			hand: 'rám-óge'.split('').map((letter) => makeTile(letter)),
		}),
	])
})
