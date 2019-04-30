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
import { setSelectedField, swapHandAndBoard, swapTiles } from './actions'
import { ThunkValue } from './ThunkValue'

export function selectFieldThunk(fieldIndexToSelect: number): ThunkValue {
	return (dispatch, getState) => {
		const state = getState()
		const { fieldIndex: selectedFieldIndex } = state
		const mode = selectMode(state)
		if (mode !== Mode.PlaceTile) return
		const handTile = selectHandTile(state)
		const selectedField = selectField(state)
		const fieldToSelect = selectBoard(state)[fieldIndexToSelect]
		if (selectedFieldIndex === fieldIndexToSelect) {
			dispatch(
				setSelectedField({
					fieldIndex: null,
				}),
			)
		} else if (
			!isUndefinedOrNull(selectedField) &&
			(selectedField.tile &&
				selectedField.tile.isOwned &&
				(!fieldToSelect.tile || fieldToSelect.tile.isOwned))
		) {
			dispatch(
				swapTiles({
					fieldIndexA: selectFieldIndex(state)!,
					fieldIndexB: fieldIndexToSelect,
				}),
			)
		} else if (
			handTile &&
			(!fieldToSelect.tile || fieldToSelect.tile.isOwned)
		) {
			dispatch(
				swapHandAndBoard({
					handIndex: selectHandIndex(state)!,
					fieldIndex: fieldIndexToSelect,
				}),
			)
		} else {
			dispatch(
				setSelectedField({
					fieldIndex: fieldIndexToSelect,
				}),
			)
		}
	}
}
