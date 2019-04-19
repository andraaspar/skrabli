import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { getWordString } from '../fun/getWordString'
import { isWordStringValid } from '../fun/isWordStringValid'
import { CENTER_FIELD_INDEX } from '../model/Constants'
import { FieldKind } from '../model/FieldKind'
import { MoveError } from '../model/MoveError'
import { IState } from '../model/State'
import { selectAllOwnedWordsFromAppState } from './selectAllOwnedWords'
import { selectWordInfoFromAppState } from './selectWordInfo'
import { selectBoardFromAppState } from './simpleSelectors'

export const selectMoveErrors = createSelector(
	[
		selectBoardFromAppState,
		selectAllOwnedWordsFromAppState,
		selectWordInfoFromAppState,
	],
	(board, words, { firstFieldIndex, lastFieldIndex, direction }) => {
		const errors: Set<MoveError> = new Set()
		if (isUndefinedOrNull(firstFieldIndex)) {
			errors.add(MoveError.NoTile)
		}
		if (errors.size === 0) {
			if (firstFieldIndex === lastFieldIndex) {
				errors.add(MoveError.OneTile)
			}
			if (errors.size === 0) {
				if (isUndefinedOrNull(direction)) {
					errors.add(MoveError.NoDirection)
				}
				if (errors.size === 0) {
					let touchesStart = false
					let touchesUnowned = false
					for (const word of words) {
						if (!isWordStringValid(getWordString(word))) {
							errors.add(MoveError.InvalidWord)
						}
						for (const field of word) {
							if (field.kind === FieldKind.Start) {
								touchesStart = true
							}
							if (field.tile && !field.tile.isOwned) {
								touchesUnowned = true
							}
						}
					}
					if (isUndefinedOrNull(board[CENTER_FIELD_INDEX].tile)) {
						errors.add(MoveError.NoStart)
					} else if (!touchesUnowned && !touchesStart) {
						errors.add(MoveError.NoConnection)
					}
				}
			}
		}
		return Array.from(errors)
	},
)

export const selectMoveErrorsFromState = (s: IState) => selectMoveErrors(s.app)
