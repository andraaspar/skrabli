import { LocalStorageKey } from '../model/LocalStorageKey'
import { ThunkValue } from './ThunkValue'

export function saveGameThunk(): ThunkValue {
	return (dispatch, getState) => {
		try {
			localStorage[LocalStorageKey.SavedGame] = JSON.stringify(getState())
		} catch (e) {
			console.error(e)
		}
	}
}
