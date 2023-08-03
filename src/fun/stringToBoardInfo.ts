import type { FieldKind } from '@/model/FieldKind'
import type { IBoardInfo } from '@/model/IBoardInfo'
import type { IBoardSize } from '@/model/IBoardSize'
import type { IField } from '@/model/IField'
import { withInterface } from './withInterface'

export function stringToBoardInfo(s: string): IBoardInfo {
	const rows = s.trim().split(/\n/)
	const rowLength = rows[0].length
	const board = rows.flatMap((row) =>
		row.split('').map((letter) =>
			withInterface<IField>({
				kind: letter as FieldKind,
				tile: null,
			}),
		),
	)
	const boardSize: IBoardSize = {
		width: rowLength,
		height: board.length / rowLength,
	}
	return {
		board,
		boardSize,
	}
}
