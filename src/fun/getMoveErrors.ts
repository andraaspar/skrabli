import { FieldKind } from '../model/FieldKind'
import type { IField } from '../model/IField'
import type { IWordInfo } from '../model/IWordInfo'
import { MoveError } from '../model/MoveError'
import type { TBoard } from '../model/TBoard'

export function getMoveErrors(
	board: TBoard,
	startFieldIndex: number,
	allOwnedWords: IField[][],
	wordInfo: IWordInfo,
) {
	const errors: Set<MoveError> = new Set()
	const { firstFieldIndex, lastFieldIndex, direction } = wordInfo
	if (firstFieldIndex == null) {
		errors.add(MoveError.NoTile)
	}
	if (errors.size === 0) {
		if (firstFieldIndex === lastFieldIndex) {
			errors.add(MoveError.OneTile)
		}
		if (errors.size === 0) {
			if (direction == null) {
				errors.add(MoveError.NoDirection)
			}
			if (errors.size === 0) {
				let touchesStart = false
				let touchesUnowned = false
				for (const word of allOwnedWords) {
					// if (!isWordStringValid(getWordString(word))) {
					// 	errors.add(MoveError.InvalidWord)
					// }
					for (const field of word) {
						if (
							field.kind === FieldKind.Start ||
							field.kind === FieldKind.StartNoBonus
						) {
							touchesStart = true
						}
						if (field.tile && !field.tile.isOwned) {
							touchesUnowned = true
						}
					}
				}
				if (board[startFieldIndex]!.tile == null) {
					errors.add(MoveError.NoStart)
				} else if (!touchesUnowned && !touchesStart) {
					errors.add(MoveError.NoConnection)
				}
			}
		}
	}
	return Array.from(errors)
}
