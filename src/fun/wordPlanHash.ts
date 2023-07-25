import type { IWordPlan } from '@/model/IWordPlan'

export function wordPlanHash(wordPlan: IWordPlan): string {
	return [
		wordPlan.fieldIndex,
		wordPlan.direction,
		// If two words differ only in the letters chosen for the joker tiles, the word should be enough to distinguish them
		wordPlan.word,
		...wordPlan.handIndices,
	].join(':')
}
