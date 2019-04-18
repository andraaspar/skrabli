import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { TState } from '../index'

export interface DispatchProp {
	dispatch: ThunkDispatch<TState, any, AnyAction>
}
