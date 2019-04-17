import { IState } from '../model/State'
import { TSetStateReducer } from '../model/TSetStateReducer'
import { createState } from './createState'

export function resetGame(): TSetStateReducer<IState> {
	return state => ({
		...createState(),
	})
}
