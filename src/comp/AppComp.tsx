import * as React from 'react'
import { connect } from 'react-redux'
import { loadGameThunk } from '../action/loadGameThunk'
import { newGameThunk } from '../action/newGameThunk'
import { savedGameExists } from '../fun/savedGameExists'
import { IAppState } from '../model/AppState'
import { TBag } from '../model/Bag'
import { Mode } from '../model/Mode'
import { selectBag, selectMode } from '../select/simpleSelectors'
import './AppComp.css'
import { BagComp } from './BagComp'
import { BoardComp } from './BoardComp'
import { DispatchProp } from './DispatchProp'
import { GameEndedComp } from './GameEndedComp'
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
	(state: IAppState): IAppCompPropsFromState => ({
		mode: selectMode(state),
		bag: selectBag(state),
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
								dispatch(newGameThunk())
							}}
						>{`Új játék`}</button>
					</>
				)}
				{mode === Mode.PlaceTile && (
					<>
						<PlayersComp isEnabled />
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
				{mode === Mode.Ended && <GameEndedComp />}
			</div>
		</>
	)
})
