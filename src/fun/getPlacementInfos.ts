import type { IPlacementInfo } from '../model/IPlacementInfo'
import type { IWordPart } from '../model/IWordPart'
import { JOKER_LETTERS } from '../model/JOKER_LETTERS'
import type { THand } from '../model/THand'
import { range } from './range'

export function getPlacementInfos({
	fieldOffset,
	wordParts,
	hand,
}: {
	fieldOffset: number
	wordParts: IWordPart[]
	hand: THand
}): IPlacementInfo[] {
	return getPlacementInfoInternal({
		alignToEnd: true,
		fieldOffset,
		hand: hand,
		wordParts: wordParts,
		handIndices: [],
		jokerLetters: [],
	})
}

function getPlacementInfoInternal({
	alignToEnd,
	fieldOffset,
	wordParts,
	hand,
	handIndices,
	jokerLetters,
}: {
	alignToEnd: boolean
	fieldOffset: number
	wordParts: IWordPart[]
	hand: THand
	handIndices: (number | null)[]
	jokerLetters: (string | null)[]
}): IPlacementInfo[] {
	if (wordParts.length === 0) return []
	const result: IPlacementInfo[] = []
	const wordPart = wordParts[0]!
	if (wordPart.gapBefore > 0) {
		// A gap (fixed tiles): skip it and add as many nulls to hand indices and
		// joker letters as necessary to skip the fixed tiles
		return getPlacementInfoInternal({
			alignToEnd: false, // Now that we have fixed tiles, we don't do this
			fieldOffset,
			wordParts: [
				{
					...wordPart,
					gapBefore: 0, // Gap handled
				},
				...wordParts.slice(1),
			],
			hand,
			handIndices: [
				...handIndices,
				...range(wordPart.gapBefore).map(() => null), // Add a null for each field skipped
			],
			jokerLetters: [
				...jokerLetters,
				...range(wordPart.gapBefore).map(() => null), // Add a null for each field skipped
			],
		})
	} else {
		// A word part: need to place tiles here
		if (wordPart.text) {
			// This word part has text: we need to place more tiles
			if (wordPart.fieldCount < 1) {
				// We're out of fields and cannot place the remaining text, so this branch
				// is a failure
				return []
			}
			// We have fields remaining, so let's try to place a tile
			for (let handIndex = 0; handIndex < hand.length; handIndex++) {
				const tile = hand[handIndex]
				// There may be empty slots in a hand, ignore them
				if (!tile) continue
				if (tile.isJoker) {
					// This is a joker, it can be placed as multiple letters, check all
					for (const letter of JOKER_LETTERS) {
						if (wordPart.text.startsWith(letter)) {
							result.push(
								...getPlacementInfoInternal({
									alignToEnd,
									fieldOffset,
									wordParts: [
										{
											...wordPart,
											fieldCount: wordPart.fieldCount - 1, // One less field to use
											text: wordPart.text.slice(letter.length), // Less text to place
										},
										...wordParts.slice(1),
									],
									hand: [
										...hand.slice(0, handIndex),
										null, // Set current hand slot to null
										...hand.slice(handIndex + 1),
									],
									handIndices: [...handIndices, handIndex], // Add hand index
									jokerLetters: [...jokerLetters, letter], // Set joker letter
								}),
							)
						}
					}
				} else if (wordPart.text.startsWith(tile.letter)) {
					// This is a non-joker tile that fits here
					result.push(
						...getPlacementInfoInternal({
							alignToEnd,
							fieldOffset,
							wordParts: [
								{
									...wordPart,
									fieldCount: wordPart.fieldCount - 1, // One less field to use
									text: wordPart.text.slice(tile.letter.length), // Less text to place
								},
								...wordParts.slice(1),
							],
							hand: [
								...hand.slice(0, handIndex),
								null, // Set current hand slot to null
								...hand.slice(handIndex + 1),
							],
							handIndices: [...handIndices, handIndex], // Add hand index
							jokerLetters: [...jokerLetters, null], // No joker letter used
						}),
					)
				}
			}
		} else {
			// No word part text: this word part has been placed
			const newFieldOffset = alignToEnd
				? fieldOffset + wordPart.fieldCount
				: fieldOffset
			if (wordParts.length === 1) {
				// No more word parts to place: return the results
				return [
					{
						handIndices,
						jokerLetters,
						fieldOffset: newFieldOffset,
					},
				]
			} else if (!alignToEnd && wordPart.fieldCount > 0) {
				// There are more gaps to fill, but we ran out of content, so this branch fails
				return []
			} else {
				// There are more word parts: move on to the next one
				return getPlacementInfoInternal({
					alignToEnd: false,
					fieldOffset: newFieldOffset,
					wordParts: wordParts.slice(1),
					hand,
					handIndices,
					jokerLetters,
				})
			}
		}
	}
	return result
}
