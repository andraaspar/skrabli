import type { IBoardSize } from '@/model/IBoardSize'
import { Direction } from '../model/Direction'
import { type IField } from '../model/IField'
import { getColumnIndex } from './getColumnIndex'
import { getColumnLine } from './getColumnLine'
import { getRowIndex } from './getRowIndex'
import { getRowLine } from './getRowLine'
import { getWordFromLine } from './getWordFromLine'

export function getWordAt(
	board: ReadonlyArray<IField>,
	boardSize: IBoardSize,
	fieldIndex: number,
	direction: Direction,
) {
	return direction === Direction.Horizontal
		? getWordFromLine(
				getRowLine(board, boardSize, getRowIndex(fieldIndex, boardSize)),
				getColumnIndex(fieldIndex, boardSize),
		  )
		: getWordFromLine(
				getColumnLine(board, boardSize, getColumnIndex(fieldIndex, boardSize)),
				getRowIndex(fieldIndex, boardSize),
		  )
}
