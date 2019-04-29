import * as React from 'react'
import { connect } from 'react-redux'
import {
	addTilesToBag,
	deselectTilesToReplace,
	fillHand,
	removeTilesToReplaceFromHand,
	resetSkipCount,
	setMode,
} from '../action/actions'
import { nextPlayerAndSaveThunk } from '../action/nextPlayerAndSaveThunk'
import { IAppState } from '../model/AppState'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import { ITile } from '../model/Tile'
import {
	selectHandIndicesToReplace,
	selectHands,
} from '../select/simpleSelectors'
import { DispatchProp } from './DispatchProp'

export interface ReplaceTilesButtonsCompPropsFromStore {
	hands: THands
	playerIndex: number | null
	handIndicesToReplace: THandIndicesToReplace
}
export interface ReplaceTilesButtonsCompProps
	extends ReplaceTilesButtonsCompPropsFromStore,
		DispatchProp {}

export const ReplaceTilesButtonsComp = connect(
	(state: IAppState): ReplaceTilesButtonsCompPropsFromStore => ({
		handIndicesToReplace: selectHandIndicesToReplace(state),
		hands: selectHands(state),
		playerIndex: state.playerIndex,
	}),
)(
	({
		hands,
		playerIndex,
		handIndicesToReplace,
		dispatch,
	}: ReplaceTilesButtonsCompProps) => {
		return (
			<>
				<button
					onClick={e => {
						const hand = hands[playerIndex!]
						const tilesToReplace = hand.filter(
							(tile, aHandIndex) =>
								handIndicesToReplace[aHandIndex],
						) as ITile[]
						dispatch(removeTilesToReplaceFromHand())
						dispatch(deselectTilesToReplace())
						dispatch(fillHand())
						dispatch(addTilesToBag({ tiles: tilesToReplace }))
						dispatch(resetSkipCount())
						dispatch(setMode(Mode.PlaceTile))
						dispatch(nextPlayerAndSaveThunk())
					}}
				>{`Csere`}</button>
				<button
					onClick={e => {
						dispatch(deselectTilesToReplace())
						dispatch(setMode(Mode.PlaceTile))
					}}
				>{`Mégse`}</button>
			</>
		)
	},
)
