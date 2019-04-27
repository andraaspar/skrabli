import * as React from 'react'
import { connect } from 'react-redux'
import { setPlayerName } from '../action/actions'
import { saveGameThunk } from '../action/saveGameThunk'
import { numberToSignedString } from '../fun/numberToSignedString'
import { TPlayers } from '../model/Player'
import { IState } from '../model/State'
import { selectPlayersFromState } from '../select/simpleSelectors'
import { DispatchProp } from './DispatchProp'

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
	(state: IState): PlayersCompPropsFromStore => ({
		players: selectPlayersFromState(state),
		playerIndex: state.app.playerIndex,
		playerBonuses: state.app.playerBonuses,
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
								<td className='player-bonus'>
									{numberToSignedString(
										playerBonuses[aPlayerIndex],
									)}
									{` `}
									{`pont`}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		)
	},
)
