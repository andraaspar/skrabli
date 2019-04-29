import * as React from 'react'
import { connect } from 'react-redux'
import { newGameThunk } from '../action/newGameThunk'
import { IAppState } from '../model/AppState'
import { Mode } from '../model/Mode'
import { selectIsGameDrawn } from '../select/selectIsGameDrawn'
import { selectWinnersNames } from '../select/selectWinnersNames'
import { selectMode } from '../select/simpleSelectors'
import { DispatchProp } from './DispatchProp'
import { PlayersComp } from './PlayersComp'

export interface GameEndedCompPropsFromStore {
	mode: Mode
	winnerName: string
	isGameDrawn: boolean
}
export interface GameEndedCompProps
	extends GameEndedCompPropsFromStore,
		DispatchProp {}

export const GameEndedComp = connect(
	(state: IAppState): GameEndedCompPropsFromStore => ({
		mode: selectMode(state),
		isGameDrawn: selectIsGameDrawn(state),
		winnerName: selectWinnersNames(state),
	}),
)(({ dispatch, mode, winnerName, isGameDrawn }: GameEndedCompProps) => {
	return (
		<>
			<div>{isGameDrawn ? `Döntetlen!` : `${winnerName} győzött!`}</div>
			<PlayersComp />
			<button
				onClick={e => {
					dispatch(newGameThunk())
				}}
			>{`Új játék`}</button>
		</>
	)
})
