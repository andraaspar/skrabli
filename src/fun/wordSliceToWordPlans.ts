import type { Direction } from '@/model/Direction'
import type { IBoardSize } from '@/model/IBoardSize'
import type { IWordPlan } from '@/model/IWordPlan'
import type { IWordSlice } from '@/model/IWordSlice'
import type { THand } from '@/model/THand'
import { getLineFieldIndex } from './getLineFieldIndex'
import { getPlacementInfos } from './getPlacementInfos'

export function wordSliceToWordPlans({
	wordSlice,
	boardSize,
	hand: originalHand,
	lineIndex,
	direction,
}: {
	wordSlice: IWordSlice
	boardSize: IBoardSize
	hand: THand
	lineIndex: number
	direction: Direction
}): IWordPlan[] {
	const wordPlans: IWordPlan[] = []

	const hand = originalHand.slice()
	// Map word slices and hand to the board.
	const placementInfos = getPlacementInfos({
		fieldOffset: wordSlice.fieldOffset,
		wordParts: wordSlice.wordParts,
		hand,
	})

	for (const placementInfo of placementInfos) {
		wordPlans.push({
			word: wordSlice.word,
			fieldIndex: getLineFieldIndex(
				boardSize,
				direction,
				lineIndex,
				placementInfo.fieldOffset,
			),
			direction,
			handIndices: placementInfo.handIndices,
			jokerLetters: placementInfo.jokerLetters,
			score: NaN,
			board: [],
			hand: [],
		})
	}

	return wordPlans
}
