import { isUndefinedOrNull } from 'illa/Type'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function nextPlayer(): TSetStateReducer {
	return state => {
		const { playerIndex } = state
		return {
			playerIndex: isUndefinedOrNull(playerIndex) ? 0 : 1 - playerIndex,
			fieldIndex: null,
			handIndex: null,
		}
	}
}
