import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { IAppState } from '../model/AppState'

export interface DispatchProp {
	dispatch: ThunkDispatch<IAppState, any, AnyAction>
}
