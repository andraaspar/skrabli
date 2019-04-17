import { IState } from './State'

export type TSetStateReducer = (s: IState) => Partial<IState>
