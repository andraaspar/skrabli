import type { IWordPlan } from '../model/IWordPlan'
import type { THand } from '../model/THand'
import { jsonClone } from './jsonClone'

export function wordPlanToHand(hand: THand, wordPlan: IWordPlan): THand {
	const result = jsonClone(hand)
	for (const index of wordPlan.handIndices) {
		if (index != null) {
			result[index] = null
		}
	}
	return result
}
