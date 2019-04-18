import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { TState } from '../index'
import { setPlayerName } from '../model/actions'
import { TPlayers } from '../model/Player'
import { selectPlayers } from '../select/simpleSelectors'

export interface PlayersCompPropsFromStore {
	players: TPlayers
	playerIndex: number | null
}
export interface PlayersCompProps
	extends PlayersCompPropsFromStore,
		DispatchProp {}

export const PlayersComp = connect(
	(state: TState): PlayersCompPropsFromStore => ({
		players: selectPlayers(state),
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
