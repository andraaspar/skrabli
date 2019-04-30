import * as React from 'react'
import { connect } from 'react-redux'
import { loadGameThunk } from '../action/loadGameThunk'
import { newGameThunk } from '../action/newGameThunk'
import { savedGameExists } from '../fun/savedGameExists'
import { IAppState } from '../model/AppState'
import { TBag } from '../model/Bag'
import { BINGO_SCORE } from '../model/Constants'
import { Mode } from '../model/Mode'
import { selectIsBingo } from '../select/selectIsBingo'
import { selectBag, selectMode } from '../select/simpleSelectors'
import './AppComp.css'
import { BagComp } from './BagComp'
import { BoardComp } from './BoardComp'
import { DispatchProp } from './DispatchProp'
import { ErrorsComp } from './ErrorsComp'
import { GameEndedComp } from './GameEndedComp'
import { HandComp } from './HandComp'
import { OwnWordInfoComp } from './OwnWordInfoComp'
import { PlacedWordInfoComp } from './PlacedWordInfoComp'
import { PlaceTileButtonsComp } from './PlaceTileButtonsComp'
import { PlayersComp } from './PlayersComp'
import { ReplaceTilesButtonsComp } from './ReplaceTilesButtonsComp'

interface IAppCompPropsFromState {
	mode: Mode
	bag: TBag
	isBingo: boolean
}
export interface IAppCompProps extends IAppCompPropsFromState, DispatchProp {}

export const AppComp = connect(
	(state: IAppState): IAppCompPropsFromState => ({
		mode: selectMode(state),
		bag: selectBag(state),
		isBingo: selectIsBingo(state),
	}),
)(({ mode, bag, isBingo, dispatch }: IAppCompProps) => {
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
						{isBingo && (
							<div className='bingo'>{`+${BINGO_SCORE} pont!`}</div>
						)}
						<OwnWordInfoComp />
						<ErrorsComp />
						<PlaceTileButtonsComp />
						<PlacedWordInfoComp />
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
