import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { IAppState } from '../model/AppState'

export type ThunkValue<T = void> = ThunkAction<
	T,
	IAppState,
	undefined,
	AnyAction
>
