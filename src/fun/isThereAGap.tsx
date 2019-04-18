import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { getFieldIndexOffset } from './getNextFieldIndex'

export function isThereAGap(
	board: ReadonlyArray<IField>,
	startFieldIndex: number,
	endFieldIndex: number,
	direction: Direction,
) {
	for (
		let fieldIndex = startFieldIndex;
		fieldIndex <= endFieldIndex;
		fieldIndex += getFieldIndexOffset(direction)
	) {
		if (!board[fieldIndex].tile) return true
	}
	return false
}
