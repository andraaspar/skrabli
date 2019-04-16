import { isUndefinedOrNull } from 'illa/Type'
import { IState } from '../model/State'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function nextPlayer(): TSetStateReducer<IState> {
	return state => {
		const { playerIndex } = state
		return {
			playerIndex: isUndefinedOrNull(playerIndex) ? 0 : 1 - playerIndex,
			fieldIndex: null,
			handIndex: null,
		}
	}
}
