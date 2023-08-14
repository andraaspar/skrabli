import { Direction } from '@/model/Direction'
import type { IWordPlan } from '@/model/IWordPlan'
import { expect, it } from 'vitest'
import { getPotentialStartingWords } from './getPotentialStartingWords'
import { makeBoard } from './test/makeBoard'
import { makeTile } from './test/makeTile'
import { withInterface } from './withInterface'

it('[ryv10x]', () => {
	const fieldsString = `
---W---
-------
-------
W--s--W
-------
-------
---W---
`
	const { board, boardSize } = makeBoard(
		`
-------
-------
-------
-------
-------
-------
-------
`,
		fieldsString,
	)
	expect(
		Array.from(
			getPotentialStartingWords({
				board,
				boardSize,
				hand: `elő`.split('').map((it) => makeTile(it)),
				words: ['elő'],
			}).values(),
		),
	).toEqual([
		withInterface<IWordPlan>({
			direction: Direction.Horizontal,
			fieldIndex: 3 * 7 + 2 - 1,
			score: 3 * 2,
			handIndices: [0, 1, 2],
			jokerLetters: [null, null, null],
			hand: `---`.split('').map((it) => makeTile(it)),
			board: makeBoard(
				`
-------
-------
-------
-ELŐ---
-------
-------
-------
`,
				fieldsString,
			).board,
			word: 'elő',
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 1 * 7 + 4 - 1,
			score: 3 * 2,
			handIndices: [0, 1, 2],
			jokerLetters: [null, null, null],
			hand: `---`.split('').map((it) => makeTile(it)),
			board: makeBoard(
				`
-------
---E---
---L---
---Ő---
-------
-------
-------
`,
				fieldsString,
			).board,
			word: 'elő',
		}),
	])
})

it('[rzdxk6]', () => {
	const fieldsString = `
-----
-----
--s-W
-----
--W--
`
	const { board, boardSize } = makeBoard(
		`
-----
-----
-----
-----
-----
`,
		fieldsString,
	)
	expect(
		Array.from(
			getPotentialStartingWords({
				board,
				boardSize,
				hand: `elő`.split('').map((it) => makeTile(it)),
				words: ['elő'],
			}).values(),
		),
	).toEqual([
		withInterface<IWordPlan>({
			direction: Direction.Horizontal,
			fieldIndex: 2 * 5 + 3 - 1,
			score: 3 * 2 * 3,
			handIndices: [0, 1, 2],
			jokerLetters: [null, null, null],
			hand: `---`.split('').map((it) => makeTile(it)),
			board: makeBoard(
				`
-----
-----
--ELŐ
-----
-----
`,
				fieldsString,
			).board,
			word: 'elő',
		}),
		withInterface<IWordPlan>({
			direction: Direction.Vertical,
			fieldIndex: 2 * 5 + 3 - 1,
			score: 3 * 2 * 3,
			handIndices: [0, 1, 2],
			jokerLetters: [null, null, null],
			hand: `---`.split('').map((it) => makeTile(it)),
			board: makeBoard(
				`
-----
-----
--E--
--L--
--Ő--
`,
				fieldsString,
			).board,
			word: 'elő',
		}),
	])
})
