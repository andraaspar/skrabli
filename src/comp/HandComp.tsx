import { get } from 'illa/FunctionUtil'
import { isUndefinedOrNull } from 'illa/Type'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { isNullOrUndefined } from 'util'
import { TState } from '../index'
import {
	selectHand,
	swapHandAndBoard,
	swapHands,
	toggleHandIndexToReplace,
} from '../model/actions'
import { TBoard } from '../model/Board'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import {
	selectBoardFromState,
	selectHandIndicesToReplaceFromState,
	selectHandsFromState,
	selectModeFromState,
} from '../select/simpleSelectors'
import { AspectComp } from './AspectComp'
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
	(state: TState): HandCompPropsFromState => ({
		hands: selectHandsFromState(state),
		playerIndex: state.app.playerIndex,
		handIndex: state.app.handIndex,
		fieldIndex: state.app.fieldIndex,
		board: selectBoardFromState(state),
		handIndicesToReplace: selectHandIndicesToReplaceFromState(state),
		mode: selectModeFromState(state),
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
