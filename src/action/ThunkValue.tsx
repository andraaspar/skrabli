import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { TState } from '../index'

export type ThunkValue<T = void> = ThunkAction<T, TState, undefined, AnyAction>
