import { FieldKind } from '../model/FieldKind'
import type { TBoard } from '../model/TBoard'

export function findStartFieldIndex(board: TBoard): number {
	for (let fieldIndex = 0; fieldIndex < board.length; fieldIndex++) {
		const kind = board[fieldIndex]!.kind
		if (kind === FieldKind.Start || kind === FieldKind.StartNoBonus) {
			return fieldIndex
		}
	}
	throw new Error(`[rycmdu] Start field not found!`)
}
