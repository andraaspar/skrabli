import { expect, it } from 'vitest'
import { FieldKind } from '../model/FieldKind'
import type { IBoardSize } from '../model/IBoardSize'
import type { IField } from '../model/IField'
import type { ITile } from '../model/ITile'
import type { TBoard } from '../model/TBoard'
import { getColumnLine } from './getColumnLine'
import { withInterface } from './withInterface'

it('[ryb8f3]', () => {
	const { board, boardSize } = makeBoard(`
-lő
--s
--f
apa
`)
	expect(getColumnLine(board, boardSize, 0)).toEqual([
		makeField(null),
		makeField(null),
		makeField(null),
		makeField('a'),
	])
})

it('[ryb8li]', () => {
	const { board, boardSize } = makeBoard(`
-lő
--s
--f
apa
`)
	expect(getColumnLine(board, boardSize, 1)).toEqual([
		makeField('l'),
		makeField(null),
		makeField(null),
		makeField('p'),
	])
})

function makeBoard(s: string) {
	const lines = s.trim().split('\n')
	const boardSize: IBoardSize = {
		height: lines.length,
		width: lines[0]!.length,
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
		isOwned: null,
		isJoker: null,
		isLast: null,
	})
}
