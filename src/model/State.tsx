import { Draft, produce } from 'immer'
import { setMode } from './actions'
import { appStateReducer, createAppState, IAppState } from './AppState'
import { Mode } from './Mode'
import { TAction } from './TAction'

export interface IState {
	readonly app: IAppState
}

export function createState(): IState {
	return {
		app: createAppState(),
	}
}

export const stateReducer = produce((state: Draft<IState>, action: TAction) => {
	state.app = appStateReducer(state.app, action) as Draft<IAppState>
}, createAppState())
stateReducer(undefined, setMode(Mode.Finished))
