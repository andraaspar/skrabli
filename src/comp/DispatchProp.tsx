import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { IState } from '../model/State'

export interface DispatchProp {
	dispatch: ThunkDispatch<IState, any, AnyAction>
}
