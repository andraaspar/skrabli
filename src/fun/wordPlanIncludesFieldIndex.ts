import type { IBoardSize } from '@/model/IBoardSize'
import type { IWordPlan } from '@/model/IWordPlan'
import { getFieldIndexOffset } from './getNextFieldIndex'

export function wordPlanIncludesFieldIndex(
	wordPlan: IWordPlan,
	fieldIndex: number,
	boardSize: IBoardSize,
): boolean {
	const fieldIndexOffset = getFieldIndexOffset(wordPlan.direction, boardSize)
	for (let i = 0; i < wordPlan.handIndices.length; i++) {
		const aFieldIndex = fieldIndex + i * fieldIndexOffset
		if (aFieldIndex === fieldIndex) return true
	}
	return false
}
