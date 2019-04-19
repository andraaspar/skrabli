import * as React from 'react'
import { connect } from 'react-redux'
import { loadGameThunk } from '../action/loadGameThunk'
import { nextPlayerAndSaveThunk } from '../action/nextPlayerAndSaveThunk'
import { savedGameExists } from '../fun/savedGameExists'
import { fillHand, nextPlayer, resetGame, setMode } from '../model/actions'
import { TBag } from '../model/Bag'
import { Mode } from '../model/Mode'
import { IState } from '../model/State'
import {
	selectBagFromState,
	selectModeFromState,
} from '../select/simpleSelectors'
import './AppComp.css'
import { BagComp } from './BagComp'
import { BoardComp } from './BoardComp'
import { DispatchProp } from './DispatchProp'
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
	(state: IState): IAppCompPropsFromState => ({
		mode: selectModeFromState(state),
		bag: selectBagFromState(state),
	}),
)(({ mode, bag, dispatch }: IAppCompProps) => {
	return (
		<>
			<BoardComp />
			<div className='tools'>
				{mode === Mode.NotStarted && (
					<>
						{savedGameExists() && (
							<button
								onClick={e => {
									dispatch(loadGameThunk())
								}}
							>{`Folytatás`}</button>
						)}
						<button
							onClick={e => {
								dispatch(resetGame())
								dispatch(nextPlayer())
								dispatch(fillHand())
								dispatch(nextPlayer())
								dispatch(fillHand())
								dispatch(setMode(Mode.PlaceTile))
								dispatch(nextPlayerAndSaveThunk())
							}}
						>{`Új játék`}</button>
					</>
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
