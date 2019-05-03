import { isUndefinedOrNull } from 'illa/Type'
import { Mode } from '../model/Mode'
import {
	selectHand,
	swapHandAndBoard,
	swapHands,
	toggleHandIndexToReplace,
} from './actions'
import { ThunkValue } from './ThunkValue'

export function selectHandThunk(handIndexToSelect: number): ThunkValue {
	return (dispatch, getState) => {
		const {
			mode,
			fieldIndex,
			board,
			handIndex,
			hands,
			playerIndex,
		} = getState()
		if (mode === Mode.ReplaceTiles) {
			dispatch(
				toggleHandIndexToReplace({
					handIndex: handIndexToSelect,
				}),
			)
		} else {
			const field = fieldIndex ? board[fieldIndex] : null
			const tile = field && field.tile
			if (field && tile && tile.isOwned) {
				dispatch(
					swapHandAndBoard({
						handIndex: handIndexToSelect,
						fieldIndex: fieldIndex!,
					}),
				)
			} else {
				if (handIndex === handIndexToSelect) {
					dispatch(
						selectHand({
							handIndex: null,
						}),
					)
				} else {
					if (isUndefinedOrNull(handIndex)) {
						dispatch(
							selectHand({
								handIndex: hands[playerIndex!][
									handIndexToSelect
								]
									? handIndexToSelect
									: null,
							}),
						)
					} else {
						dispatch(
							swapHands({
								handIndexA: handIndex,
								handIndexB: handIndexToSelect,
							}),
						)
					}
				}
			}
		}
	}
}
