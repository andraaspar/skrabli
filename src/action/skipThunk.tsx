import { collectTiles, incrementSkipCount } from './actions'
import { endGameThunk } from './endGameThunk'
import { nextPlayerAndSaveThunk } from './nextPlayerAndSaveThunk'
import { ThunkValue } from './ThunkValue'

export function skipThunk(): ThunkValue {
	return (dispatch, getState) => {
		dispatch(incrementSkipCount())
		dispatch((dispatch, getState) => {
			const state = getState()
			if ((state.skipCount || 0) > 3) {
				dispatch(endGameThunk())
			} else {
				dispatch(collectTiles())
				dispatch(nextPlayerAndSaveThunk())
			}
		})
	}
}
