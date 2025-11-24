import { AiLevel } from '../model/AiLevel'
import type { IWordPlan } from '../model/IWordPlan'

export function getMoveByAiLevel(
	movesUnsorted: IWordPlan[],
	aiLevel: AiLevel,
): IWordPlan {
	if (movesUnsorted.length === 0) {
		throw new Error(`[rytggu] No moves.`)
	}
	if (movesUnsorted.length === 1) {
		return movesUnsorted[0]!
	}
	const moves = movesUnsorted
		.slice()
		.sort(
			(a, b) =>
				b.score - a.score || b.handIndices.length - a.handIndices.length,
		)
	const max = moves[0]!.score
	const min = moves[moves.length - 1]!.score
	const range = max - min
	switch (aiLevel) {
		case AiLevel.Easy:
			return moves.find((move) => move.score < min + range * 0.1)!
		case AiLevel.Medium:
			return moves.find((move) => move.score < min + range * 0.25)!
		case AiLevel.Hard:
			return moves.find((move) => move.score < min + range * 0.5)!
		case AiLevel.VeryHard:
			return moves.find((move) => move.score < min + range * 0.75)!
		case AiLevel.Ultimate:
			return moves[0]!
	}
	throw new Error(`[rytgn0]`)
}
