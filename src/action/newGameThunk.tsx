import { Mode } from '../model/Mode'
import { selectPlayers } from '../select/simpleSelectors'
import {
	fillHand,
	nextPlayer,
	resetGame,
	setMode,
	setPlayerName,
} from './actions'
import { nextPlayerAndSaveThunk } from './nextPlayerAndSaveThunk'
import { ThunkValue } from './ThunkValue'

export function newGameThunk(): ThunkValue {
	return (dispatch, getState) => {
		const state = getState()
		const players = selectPlayers(state)
		const names = players.map(player => player.name)
		dispatch(resetGame())
		names.forEach((name, playerIndex) => {
			dispatch(
				setPlayerName({
					playerIndex,
					name,
				}),
			)
		})
		dispatch(nextPlayer())
		dispatch(fillHand())
		dispatch(nextPlayer())
		dispatch(fillHand())
		dispatch(setMode(Mode.PlaceTile))
		dispatch(nextPlayerAndSaveThunk())
	}
}
