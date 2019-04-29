import * as React from 'react'
import { connect } from 'react-redux'
import { setPlayerName } from '../action/actions'
import { saveGameThunk } from '../action/saveGameThunk'
import { numberToSignedString } from '../fun/numberToSignedString'
import { IAppState } from '../model/AppState'
import { TPlayers } from '../model/Player'
import { selectPlayers } from '../select/simpleSelectors'
import { DispatchProp } from './DispatchProp'
import './PlayersComp.css'

export interface PlayersCompPropsFromStore {
	players: TPlayers
	playerIndex: number | null
	playerBonuses: ReadonlyArray<number> | null
}
export interface PlayersCompProps
	extends PlayersCompPropsFromStore,
		DispatchProp {
	isEnabled?: boolean
}

export const PlayersComp = connect(
	(state: IAppState): PlayersCompPropsFromStore => ({
		players: selectPlayers(state),
		playerIndex: state.playerIndex,
		playerBonuses: state.playerBonuses,
	}),
)(
	({
		players,
		playerIndex,
		playerBonuses,
		dispatch,
		isEnabled,
	}: PlayersCompProps) => {
		return (
			<table className='players'>
				<tbody>
					{players.map((player, aPlayerIndex) => (
						<tr className='player' key={aPlayerIndex}>
							<td>
								{isEnabled ? (
									<button
										className='player-name-button'
										onClick={e => {
											const name = prompt(`Mi a neved?`)
											if (name && name.trim()) {
												dispatch(
													setPlayerName({
														playerIndex: aPlayerIndex,
														name: name.trim(),
													}),
												)
												dispatch(saveGameThunk())
											}
										}}
									>
										{player.name}
									</button>
								) : (
									player.name
								)}
							</td>
							{isEnabled && (
								<td>{aPlayerIndex === playerIndex && `•`}</td>
							)}
							<td>
								{player.score}
								{` `}
								{`pont`}
							</td>
							{playerBonuses && (
								<td>
									<div className='player-bonus'>
										{numberToSignedString(
											playerBonuses[aPlayerIndex],
										)}
										{` `}
										{`pont`}
									</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		)
	},
)
