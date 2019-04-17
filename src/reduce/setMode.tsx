import { Mode } from '../model/Mode'
import { TSetStateReducer } from '../model/TSetStateReducer'

export function setMode(mode: Mode): TSetStateReducer {
	return state => ({
		mode,
		fieldIndex: mode === state.mode ? state.fieldIndex : null,
		handIndex: mode === state.mode ? state.handIndex : null,
	})
}
