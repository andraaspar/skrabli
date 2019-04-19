import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { IState } from '../model/State'

export type ThunkValue<T = void> = ThunkAction<T, IState, undefined, AnyAction>
