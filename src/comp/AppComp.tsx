import * as React from 'react'
import { useContext } from 'react'
import { fillHand } from '../fun/fillHand'
import { nextPlayer } from '../fun/nextPlayer'
import { resetGame } from '../fun/resetGame'
import { setMode } from '../fun/setMode'
import { Mode } from '../model/Mode'
import './AppComp.css'
import { BagComp } from './BagComp'
import { BoardComp } from './BoardComp'
import { SetStateContext, StateContext } from './ContextProvider'
import { HandComp } from './HandComp'
import { PlaceTileButtonsComp } from './PlaceTileButtonsComp'
import { PlayersComp } from './PlayersComp'
import { ReplaceTilesButtonsComp } from './ReplaceTilesButtonsComp'
import { WordInfoComp } from './WordInfoComp'

export function AppComp() {
	const { mode } = useContext(StateContext)
	const setState = useContext(SetStateContext)
	return (
		<>
			<BoardComp />
			<div className='tools'>
				{mode === Mode.NotStarted && (
					<button
						onClick={e => {
							setState(resetGame())
							setState(nextPlayer())
							setState(fillHand())
							setState(nextPlayer())
							setState(fillHand())
							setState(nextPlayer())
							setState(setMode(Mode.PlaceTile))
						}}
					>{`Új játék`}</button>
				)}
				{mode === Mode.PlaceTile && (
					<>
						<PlayersComp />
						<BagComp />
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
}
