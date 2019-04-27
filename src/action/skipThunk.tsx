import { Mode } from '../model/Mode'
import { selectPlayerBonusesFromState } from '../select/selectPlayerBonuses'
import {
	collectTiles,
	incrementSkipCount,
	scoreBonuses,
	setMode,
} from './actions'
import { nextPlayerAndSaveThunk } from './nextPlayerAndSaveThunk'
import { ThunkValue } from './ThunkValue'

export function skipThunk(): ThunkValue {
	return (dispatch, getState) => {
		dispatch(incrementSkipCount())
		dispatch((dispatch, getState) => {
			const state = getState()
			if ((state.app.skipCount || 0) > 3) {
				dispatch(setMode(Mode.Drawn))
				dispatch(scoreBonuses(selectPlayerBonusesFromState(state)))
			} else {
				dispatch(collectTiles())
				dispatch(nextPlayerAndSaveThunk())
			}
		})
	}
}
