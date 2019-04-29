import { Mode } from '../model/Mode'
import { selectPlayerBonuses } from '../select/selectPlayerBonuses'
import { scoreBonuses, setMode } from './actions'
import { ThunkValue } from './ThunkValue'

export function endGameThunk(): ThunkValue {
	return (dispatch, getState) => {
		const state = getState()
		dispatch(scoreBonuses(selectPlayerBonuses(state)))
		dispatch(setMode(Mode.Ended))
	}
}
