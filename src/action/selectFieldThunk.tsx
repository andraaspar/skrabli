import { get } from 'illa/FunctionUtil'
import { isUndefinedOrNull } from 'illa/Type'
import { Mode } from '../model/Mode'
import { selectField } from '../select/selectField'
import { selectHandTile } from '../select/selectHandTile'
import {
	selectBoard,
	selectFieldIndex,
	selectHandIndex,
	selectMode,
} from '../select/simpleSelectors'
import {
	setSelectedField as selectFieldAction,
	setSelectedField,
	swapHandAndBoard,
	swapTiles,
} from './actions'
import { ThunkValue } from './ThunkValue'

export function selectFieldThunk(fieldIndexToSelect: number): ThunkValue {
	return (dispatch, getState) => {
		const state = getState()
		const mode = selectMode(state)
		if (mode !== Mode.PlaceTile) return
		const handTile = selectHandTile(state)
		const oldField = selectField(state)
		const fieldToSelect = selectBoard(state)[fieldIndexToSelect]
		if (!fieldToSelect.tile || fieldToSelect.tile.isOwned) {
			if (handTile) {
				dispatch(
					swapHandAndBoard({
						handIndex: selectHandIndex(state)!,
						fieldIndex: fieldIndexToSelect,
					}),
				)
			} else {
				if (fieldToSelect === oldField) {
					dispatch(
						selectFieldAction({
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
							selectFieldAction({
								fieldIndex: fieldToSelect.tile
									? fieldIndexToSelect
									: null,
							}),
						)
					} else {
						dispatch(
							swapTiles({
								fieldIndexA: selectFieldIndex(state)!,
								fieldIndexB: fieldIndexToSelect,
							}),
						)
					}
				}
			}
		} else {
			dispatch(setSelectedField({ fieldIndex: null }))
		}
	}
}
