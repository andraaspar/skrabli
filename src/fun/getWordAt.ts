import { Direction } from '../model/Direction'
import { type IField } from '../model/IField'
import { getColumnIndex } from './getColumnIndex'
import { getColumnLine } from './getColumnLine'
import { getRowIndex } from './getRowIndex'
import { getRowLine } from './getRowLine'
import { getWordFromLine } from './getWordFromLine'

export function getWordAt(
	board: ReadonlyArray<IField>,
	fieldIndex: number,
	direction: Direction,
) {
	return direction === Direction.Horizontal
		? getWordFromLine(
				getRowLine(board, getRowIndex(fieldIndex)),
				getColumnIndex(fieldIndex),
		  )
		: getWordFromLine(
				getColumnLine(board, getColumnIndex(fieldIndex)),
				getRowIndex(fieldIndex),
		  )
}
