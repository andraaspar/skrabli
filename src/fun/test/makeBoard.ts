import { FieldKind } from '../../model/FieldKind'
import { IBoardSize } from '../../model/IBoardSize'
import { TBoard } from '../../model/TBoard'
import { range } from '../range'
import { makeField } from './makeField'

export function makeBoard(tilesString: string, fieldsString?: string) {
	const lines = tilesString.trim().split('\n')
	const boardSize: IBoardSize = {
		height: lines.length,
		width: lines[0]!.length,
	}
	const fields = fieldsString
		? fieldsString.trim().replace(/\n/g, '').split('')
		: range(boardSize.width * boardSize.height).map(() => FieldKind.Normal)
	const board: TBoard = lines
		.join('')
		.split('')
		.map((letter, index) =>
			makeField(letter === '-' ? null : letter, fields[index] as FieldKind),
		)
	return { boardSize, board }
}
