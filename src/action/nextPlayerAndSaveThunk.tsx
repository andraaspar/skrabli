import { nextPlayer } from '../model/actions'
import { saveGameThunk } from './saveGameThunk'
import { ThunkValue } from './ThunkValue'

export function nextPlayerAndSaveThunk(): ThunkValue {
	return (dispatch, getState) => {
		dispatch(nextPlayer())
		dispatch(saveGameThunk())
	}
}
