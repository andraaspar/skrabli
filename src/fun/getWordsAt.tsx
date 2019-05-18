import { IField } from '../model/Field'
import { getColumnIndex } from './getColumnIndex'
import { getColumnLine } from './getColumnLine'
import { getRowIndex } from './getRowIndex'
import { getRowLine } from './getRowLine'
import { getWordFromLine } from './getWordFromLine'

export function getWordsAt(board: ReadonlyArray<IField>, fieldIndex: number) {
	return {
		horizontal: getWordFromLine(
			getRowLine(board, getRowIndex(fieldIndex)),
			getColumnIndex(fieldIndex),
		),
		vertical: getWordFromLine(
			getColumnLine(board, getColumnIndex(fieldIndex)),
			getRowIndex(fieldIndex),
		),
	}
}
