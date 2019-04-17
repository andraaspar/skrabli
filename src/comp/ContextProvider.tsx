import React, { useReducer } from 'react'
import { IState } from '../model/State'
import { TSetState } from '../model/TSetState'
import { TSetStateReducer } from '../model/TSetStateReducer'
import { createState } from '../reduce/createState'

export const StateContext = React.createContext((null as any) as IState)
export const SetStateContext = React.createContext((null as any) as TSetState)

export function ContextProvider({ children }: React.PropsWithChildren<{}>) {
	const [state, setState] = useReducer(
		(state: IState, reducer: TSetStateReducer): IState => {
			const s = reducer(state)
			if (process.env.NODE_ENV !== 'production')
				console.log(`setState:`, s)
			return { ...state, ...s }
		},
		createState(),
	)
	if (process.env.NODE_ENV !== 'production') console.log(`Render:`, state)
	return (
		<StateContext.Provider value={state}>
			<SetStateContext.Provider value={setState}>
				{children}
			</SetStateContext.Provider>
		</StateContext.Provider>
	)
}
