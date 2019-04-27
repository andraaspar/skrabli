import * as React from 'react'
import { connect } from 'react-redux'
import { nextPlayerAndSaveThunk } from '../action/nextPlayerAndSaveThunk'
import {
	addTilesToBag,
	deselectTilesToReplace,
	fillHand,
	removeTilesToReplaceFromHand,
	setMode,
} from '../action/actions'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import { IState } from '../model/State'
import { ITile } from '../model/Tile'
import {
	selectHandIndicesToReplaceFromState,
	selectHandsFromState,
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
	(state: IState): ReplaceTilesButtonsCompPropsFromStore => ({
		handIndicesToReplace: selectHandIndicesToReplaceFromState(state),
		hands: selectHandsFromState(state),
		playerIndex: state.app.playerIndex,
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
