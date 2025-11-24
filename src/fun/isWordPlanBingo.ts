import { HAND_SIZE } from '../model/Constants'
import type { IWordPlan } from '../model/IWordPlan'

export function isWordPlanBingo(wordPlan: IWordPlan): boolean {
	return wordPlan.handIndices.filter((it) => it != null).length === HAND_SIZE
}
