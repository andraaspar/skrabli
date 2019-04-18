import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { TState } from '../index'
import {
	addTilesToBag,
	deselectTilesToReplace,
	fillHand,
	nextPlayer,
	removeTilesToReplaceFromHand,
	setMode,
} from '../model/actions'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import { ITile } from '../model/Tile'
import {
	selectHandIndicesToReplace,
	selectHands,
} from '../select/simpleSelectors'

export interface ReplaceTilesButtonsCompPropsFromStore {
	hands: THands
	playerIndex: number | null
	handIndicesToReplace: THandIndicesToReplace
}
export interface ReplaceTilesButtonsCompProps
	extends ReplaceTilesButtonsCompPropsFromStore,
		DispatchProp {}

export const ReplaceTilesButtonsComp = connect(
	(state: TState): ReplaceTilesButtonsCompPropsFromStore => ({
		handIndicesToReplace: selectHandIndicesToReplace(state),
		hands: selectHands(state),
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
						dispatch(nextPlayer())
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
