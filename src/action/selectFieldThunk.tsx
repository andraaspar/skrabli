import { get } from 'illa/FunctionUtil'
import { isUndefinedOrNull } from 'illa/Type'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { TState } from '../index'
import { selectField, swapHandAndBoard, swapTiles } from '../model/actions'
import { Mode } from '../model/Mode'
import { selectFieldFromState } from '../select/selectField'
import { selectHandTileFromState } from '../select/selectHandTile'
import {
	selectBoardFromState,
	selectFieldIndexFromState,
	selectHandIndexFromState,
	selectModeFromState,
} from '../select/simpleSelectors'

export function selectFieldThunk(
	fieldIndexToSelect: number,
): ThunkAction<void, TState, undefined, AnyAction> {
	return (dispatch, getState) => {
		const state = getState()
		const mode = selectModeFromState(state)
		if (mode !== Mode.PlaceTile) return
		const handTile = selectHandTileFromState(state)
		const oldField = selectFieldFromState(state)
		const fieldToSelect = selectBoardFromState(state)[fieldIndexToSelect]
		if (!fieldToSelect.tile || fieldToSelect.tile.isOwned) {
			if (handTile) {
				dispatch(
					swapHandAndBoard({
						handIndex: selectHandIndexFromState(state)!,
						fieldIndex: fieldIndexToSelect,
					}),
				)
			} else {
				if (fieldToSelect === oldField) {
					dispatch(
						selectField({
							fieldIndex: null,
						}),
					)
				} else {
					if (
						isUndefinedOrNull(oldField) ||
						(!get(() => oldField!.tile!.isOwned) &&
							!get(() => fieldToSelect.tile!.isOwned))
					) {
						dispatch(
							selectField({
								fieldIndex: fieldToSelect.tile
									? fieldIndexToSelect
									: null,
							}),
						)
					} else {
						dispatch(
							swapTiles({
								fieldIndexA: selectFieldIndexFromState(state)!,
								fieldIndexB: fieldIndexToSelect,
							}),
						)
					}
				}
			}
		} else {
			dispatch(selectField({ fieldIndex: null }))
		}
	}
}
