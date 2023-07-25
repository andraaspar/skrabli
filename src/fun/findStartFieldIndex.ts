import { FieldKind } from '@/model/FieldKind'
import type { TBoard } from '@/model/TBoard'

export function findStartFieldIndex(board: TBoard): number {
	for (let fieldIndex = 0; fieldIndex < board.length; fieldIndex++) {
		if (board[fieldIndex].kind === FieldKind.Start) {
			return fieldIndex
		}
	}
	throw new Error(`[rycmdu] Start field not found!`)
}
