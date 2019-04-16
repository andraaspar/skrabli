import { TSetStateReducer } from './TSetStateReducer'
export type TSetState<T> = (r: TSetStateReducer<T>) => void
