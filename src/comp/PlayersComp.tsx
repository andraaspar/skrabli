import * as React from 'react'
import { connect } from 'react-redux'
import { saveGameThunk } from '../action/saveGameThunk'
import { setPlayerName } from '../action/actions'
import { TPlayers } from '../model/Player'
import { IState } from '../model/State'
import { selectPlayersFromState } from '../select/simpleSelectors'
import { DispatchProp } from './DispatchProp'

export interface PlayersCompPropsFromStore {
	players: TPlayers
	playerIndex: number | null
}
export interface PlayersCompProps
	extends PlayersCompPropsFromStore,
		DispatchProp {}

export const PlayersComp = connect(
	(state: IState): PlayersCompPropsFromStore => ({
		players: selectPlayersFromState(state),
		playerIndex: state.app.playerIndex,
	}),
)(({ players, playerIndex, dispatch }: PlayersCompProps) => {
	return (
		<table className='players'>
			<tbody>
				{players.map((player, aPlayerIndex) => (
					<tr className='player' key={aPlayerIndex}>
						<td>
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
						</td>
						<td>{aPlayerIndex === playerIndex && `•`}</td>
						<td>
							{player.score}
							{` `}
							{`pont`}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
})
