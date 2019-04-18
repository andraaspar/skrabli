import { ThunkValue } from './ThunkValue'

export function saveGameThunk(): ThunkValue {
	return (dispatch, getState) => {
		localStorage['game'] = JSON.stringify(getState())
	}
}
