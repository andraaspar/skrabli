import { expect, it } from 'vitest'
import { Direction } from '../model/Direction'
import { makeBoard } from './test/makeBoard'
import { makeTile } from './test/makeTile'
import { wordPlanIncludesFieldIndex } from './wordPlanIncludesFieldIndex'

it('[ryv6wd]', () => {
	const { board, boardSize } = makeBoard(`EL-`, `-s-`)
	const startIndex = 1
	expect(
		wordPlanIncludesFieldIndex(
			{
				direction: Direction.Horizontal,
				board: board,
				fieldIndex: 0,
				handIndices: [0, 1],
				hand: `--`.split('').map((it) => makeTile(it)),
				jokerLetters: `--`.split('').map(() => null),
				score: 2,
				word: 'el',
			},
			startIndex,
			boardSize,
		),
	).toEqual(true)
})

it('[ryv78q]', () => {
	const { board, boardSize } = makeBoard(`EL-`, `--s`)
	const startIndex = 2
	expect(
		wordPlanIncludesFieldIndex(
			{
				direction: Direction.Horizontal,
				board: board,
				fieldIndex: 0,
				handIndices: [0, 1],
				hand: `--`.split('').map((it) => makeTile(it)),
				jokerLetters: `--`.split('').map(() => null),
				score: 2,
				word: 'el',
			},
			startIndex,
			boardSize,
		),
	).toEqual(false)
})
