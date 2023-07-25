import type { IBoardSize } from '@/model/IBoardSize'
import type { IWordPlan } from '@/model/IWordPlan'
import { getFieldIndexOffset } from './getNextFieldIndex'

export function replaceHandIndexInWordPlan(
	wordPlan: IWordPlan,
	fieldIndex: number,
	handIndex: number,
	boardSize: IBoardSize,
) {
	const fieldIndexOffset = getFieldIndexOffset(wordPlan.direction, boardSize)
	for (let i = 0; i < wordPlan.handIndices.length; i++) {
		const aFieldIndex = wordPlan.fieldIndex + i * fieldIndexOffset
		if (aFieldIndex === fieldIndex) {
			wordPlan.handIndices[i] = handIndex
			break
		}
	}
}
