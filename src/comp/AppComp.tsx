import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { TState } from '../index'
import { fillHand, nextPlayer, resetGame, setMode } from '../model/actions'
import { TBag } from '../model/Bag'
import { Mode } from '../model/Mode'
import {
	selectBagFromState,
	selectModeFromState,
} from '../select/simpleSelectors'
import './AppComp.css'
import { BagComp } from './BagComp'
import { BoardComp } from './BoardComp'
import { HandComp } from './HandComp'
import { PlaceTileButtonsComp } from './PlaceTileButtonsComp'
import { PlayersComp } from './PlayersComp'
import { ReplaceTilesButtonsComp } from './ReplaceTilesButtonsComp'
import { WordInfoComp } from './WordInfoComp'

interface IAppCompPropsFromState {
	mode: Mode
	bag: TBag
}
export interface IAppCompProps extends IAppCompPropsFromState, DispatchProp {}

export const AppComp = connect(
	(state: TState): IAppCompPropsFromState => ({
		mode: selectModeFromState(state),
		bag: selectBagFromState(state),
	}),
)(({ mode, bag, dispatch }: IAppCompProps) => {
	return (
		<>
			<BoardComp />
			<div className='tools'>
				{mode === Mode.NotStarted && (
					<button
						onClick={e => {
							dispatch(resetGame())
							dispatch(nextPlayer())
							dispatch(fillHand())
							dispatch(nextPlayer())
							dispatch(fillHand())
							dispatch(nextPlayer())
							dispatch(setMode(Mode.PlaceTile))
						}}
					>{`Új játék`}</button>
				)}
				{mode === Mode.PlaceTile && (
					<>
						<PlayersComp />
						<BagComp bag={bag} />
						<HandComp />
						<WordInfoComp />
						<PlaceTileButtonsComp />
					</>
				)}
				{mode === Mode.ReplaceTiles && (
					<>
						<HandComp />
						<ReplaceTilesButtonsComp />
					</>
				)}
				{mode === Mode.Finished && <></>}
			</div>
		</>
	)
})
