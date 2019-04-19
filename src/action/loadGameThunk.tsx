import { get } from 'illa/FunctionUtil'
import { setGame } from '../model/actions'
import { LocalStorageKey } from '../model/LocalStorageKey'
import { IState } from '../model/State'
import { ThunkValue } from './ThunkValue'

export function loadGameThunk(): ThunkValue {
	return (dispatch, getState) => {
		const savedGame = get(
			() => JSON.parse(localStorage[LocalStorageKey.SavedGame]) as IState,
		)
		if (savedGame) {
			dispatch(setGame({ game: savedGame }))
		}
	}
}
