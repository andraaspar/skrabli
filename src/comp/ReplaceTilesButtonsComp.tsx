import * as React from 'react'
import { useContext } from 'react'
import { fillHand } from '../fun/fillHand'
import { nextPlayer } from '../fun/nextPlayer'
import { setMode } from '../fun/setMode'
import { Mode } from '../model/Mode'
import { ITile } from '../model/Tile'
import { SetStateContext, StateContext } from './ContextProvider'

export function ReplaceTilesButtonsComp() {
	const { hands, playerIndex, handIndicesToReplace } = useContext(
		StateContext,
	)
	const setState = useContext(SetStateContext)
	return (
		<>
			<button
				onClick={e => {
					const hand = hands[playerIndex!]
					const tilesToReplace = hand.filter(
						(tile, aHandIndex) => handIndicesToReplace[aHandIndex],
					) as ITile[]
					setState(
						({ hands, playerIndex, handIndicesToReplace }) => ({
							hands: hands.map((hand, aPlayerIndex) =>
								aPlayerIndex === playerIndex
									? hand.map((tile, aHandIndex) =>
											handIndicesToReplace[aHandIndex]
												? null
												: tile,
									  )
									: hand,
							),
							handIndicesToReplace: handIndicesToReplace.map(
								_ => false,
							),
						}),
					)
					setState(fillHand())
					setState(({ bag }) => ({
						bag: bag.concat(tilesToReplace),
					}))
					setState(setMode(Mode.PlaceTile))
					setState(nextPlayer())
				}}
			>{`Csere`}</button>
			<button
				onClick={e => {
					setState(({ handIndicesToReplace }) => ({
						handIndicesToReplace: handIndicesToReplace.map(
							_ => false,
						),
					}))
					setState(setMode(Mode.PlaceTile))
				}}
			>{`Mégse`}</button>
		</>
	)
}
