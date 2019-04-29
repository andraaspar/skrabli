import { get } from 'illa/FunctionUtil'
import { IAppState } from '../model/AppState'
import { LocalStorageKey } from '../model/LocalStorageKey'
import { setGame } from './actions'
import { ThunkValue } from './ThunkValue'

export function loadGameThunk(): ThunkValue {
	return (dispatch, getState) => {
		const savedGame = get(() =>
			JSON.parse(localStorage[LocalStorageKey.SavedGame]),
		)
		if (savedGame) {
			const game: IAppState = savedGame.app || savedGame
			if (game) {
				dispatch(setGame({ game }))
			}
		}
	}
}
