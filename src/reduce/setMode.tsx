import { Mode } from '../model/Mode'
import { IState } from '../model/State'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function setMode(mode: Mode): TSetStateReducer<IState> {
	return state => ({
		mode,
		fieldIndex: mode === state.mode ? state.fieldIndex : null,
		handIndex: mode === state.mode ? state.handIndex : null,
	})
}
