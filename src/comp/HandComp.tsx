import { get } from 'illa/FunctionUtil'
import { isUndefinedOrNull } from 'illa/Type'
import * as React from 'react'
import { useContext } from 'react'
import { isNullOrUndefined } from 'util'
import { swapHandAndBoard } from '../reduce/swapHandAndBoard'
import { swapHands } from '../reduce/swapHands'
import { Mode } from '../model/Mode'
import { AspectComp } from './AspectComp'
import { SetStateContext, StateContext } from './ContextProvider'
import './HandComp.css'
import { TileComp } from './TileComp'

export function HandComp() {
	const {
		hands,
		playerIndex,
		handIndex,
		board,
		fieldIndex,
		mode,
		handIndicesToReplace,
	} = useContext(StateContext)
	const setState = useContext(SetStateContext)
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
									setState(state => ({
										handIndicesToReplace: handIndicesToReplace.map(
											(flag, index) =>
												index === aHandIndex
													? !flag
													: flag,
										),
									}))
								} else {
									if (get(() => board[fieldIndex!].tile)) {
										setState(
											swapHandAndBoard({
												handIndex: aHandIndex,
												fieldIndex: fieldIndex!,
											}),
										)
									} else {
										if (handIndex === aHandIndex) {
											setState(state => ({
												handIndex: null,
											}))
										} else {
											if (isUndefinedOrNull(handIndex)) {
												setState(state => ({
													handIndex: hands[
														playerIndex!
													][aHandIndex]
														? aHandIndex
														: null,
												}))
											} else {
												setState(
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
								{tile && <TileComp tile={tile} neverOwned />}
							</AspectComp>
						</div>
					))}
				</div>
			)}
		</>
	)
}
