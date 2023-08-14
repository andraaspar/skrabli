import type { THand } from '../model/THand'

export function findHandTileIndices(letter: string, hand: THand): number[] {
	let result: number[] = []
	for (let handIndex = 0; handIndex < hand.length; handIndex++) {
		const tile = hand[handIndex]
		if (tile?.letter === letter || tile?.isJoker) {
			result.push(handIndex)
		}
	}
	return result
}
