import { selectHandCountFromState } from '../select/selectHandCount'
import { selectBagFromState } from '../select/simpleSelectors'
import { disownTiles, fillHand, resetSkipCount, score } from './actions'
import { endGameThunk } from './endGameThunk'
import { nextPlayerAndSaveThunk } from './nextPlayerAndSaveThunk'
import { ThunkValue } from './ThunkValue'

export function doneThunk(): ThunkValue {
	return (dispatch, getState) => {
		dispatch(score())
		dispatch(disownTiles())
		dispatch(resetSkipCount())
		dispatch((dispatch, getState) => {
			const state = getState()
			if (
				selectBagFromState(state).length ||
				selectHandCountFromState(state)
			) {
				dispatch(fillHand())
				dispatch(nextPlayerAndSaveThunk())
			} else {
				dispatch(endGameThunk())
			}
		})
	}
}
