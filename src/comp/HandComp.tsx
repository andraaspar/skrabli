import { get } from 'illa/FunctionUtil'
import { isUndefinedOrNull } from 'illa/Type'
import * as React from 'react'
import { connect } from 'react-redux'
import { isNullOrUndefined } from 'util'
import {
	selectHand,
	swapHandAndBoard,
	swapHands,
	toggleHandIndexToReplace,
} from '../action/actions'
import { IAppState } from '../model/AppState'
import { TBoard } from '../model/Board'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import {
	selectBoard,
	selectHandIndicesToReplace,
	selectHands,
	selectMode,
} from '../select/simpleSelectors'
import { AspectComp } from './AspectComp'
import { DispatchProp } from './DispatchProp'
import './HandComp.css'
import { TileComp } from './TileComp'

interface HandCompPropsFromState {
	hands: THands
	playerIndex: number | null
	handIndex: number | null
	board: TBoard
	fieldIndex: number | null
	mode: Mode
	handIndicesToReplace: THandIndicesToReplace
}
export interface HandCompProps extends HandCompPropsFromState, DispatchProp {}

export const HandComp = connect(
	(state: IAppState): HandCompPropsFromState => ({
		hands: selectHands(state),
		playerIndex: state.playerIndex,
		handIndex: state.handIndex,
		fieldIndex: state.fieldIndex,
		board: selectBoard(state),
		handIndicesToReplace: selectHandIndicesToReplace(state),
		mode: selectMode(state),
	}),
)(
	({
		board,
		dispatch,
		fieldIndex,
		handIndex,
		handIndicesToReplace,
		hands,
		mode,
		playerIndex,
	}: HandCompProps) => {
		return (
			<>
				{!isNullOrUndefined(playerIndex) && (
					<div className='hand'>
						{hands[playerIndex].map((tile, aHandIndex) => (
							<div
								key={aHandIndex}
								className={[
									'hand-slot',
									handIndex === aHandIndex && 'is-selected',
									handIndicesToReplace[aHandIndex] &&
										'is-to-be-replaced',
								]
									.filter(Boolean)
									.join(' ')}
								onClick={e => {
									if (mode === Mode.ReplaceTiles) {
										dispatch(
											toggleHandIndexToReplace({
												handIndex: aHandIndex,
											}),
										)
									} else {
										if (
											get(() => board[fieldIndex!].tile)
										) {
											dispatch(
												swapHandAndBoard({
													handIndex: aHandIndex,
													fieldIndex: fieldIndex!,
												}),
											)
										} else {
											if (handIndex === aHandIndex) {
												dispatch(
													selectHand({
														handIndex: null,
													}),
												)
											} else {
												if (
													isUndefinedOrNull(handIndex)
												) {
													dispatch(
														selectHand({
															handIndex: hands[
																playerIndex!
															][aHandIndex]
																? aHandIndex
																: null,
														}),
													)
												} else {
													dispatch(
														swapHands({
															handIndexA: handIndex,
															handIndexB: aHandIndex,
														}),
													)
												}
											}
										}
									}
								}}
							>
								<AspectComp width={1} height={1}>
									{tile && (
										<TileComp tile={tile} neverOwned />
									)}
								</AspectComp>
							</div>
						))}
					</div>
				)}
			</>
		)
	},
)
