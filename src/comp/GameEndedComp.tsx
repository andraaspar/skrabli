import * as React from 'react'
import { connect } from 'react-redux'
import { newGameThunk } from '../action/newGameThunk'
import { Mode } from '../model/Mode'
import { IState } from '../model/State'
import { selectIsGameDrawnFromState } from '../select/selectIsGameDrawn'
import { selectWinnersNamesFromState } from '../select/selectWinnersNames'
import { selectModeFromState } from '../select/simpleSelectors'
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
	(state: IState): GameEndedCompPropsFromStore => ({
		mode: selectModeFromState(state),
		isGameDrawn: selectIsGameDrawnFromState(state),
		winnerName: selectWinnersNamesFromState(state),
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
