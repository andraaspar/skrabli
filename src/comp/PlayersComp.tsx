import * as React from 'react'
import { useContext } from 'react'
import { SetStateContext, StateContext } from './ContextProvider'
import './PlayersComp.css'

export function PlayersComp() {
	const c = useContext(StateContext)
	const setState = useContext(SetStateContext)
	return (
		<table className='players'>
			<tbody>
				{c.players.map((player, playerIndex) => (
					<tr className='player' key={playerIndex}>
						<td>
							<button
								className='player-name-button'
								onClick={e => {
									const name = prompt(`Mi a neved?`)
									if (name && name.trim()) {
										setState(({ players }) => ({
											players: players.map(
												(player, aPlayerIndex) =>
													aPlayerIndex === playerIndex
														? {
																...player,
																name: name.trim(),
														  }
														: player,
											),
										}))
									}
								}}
							>
								{player.name}
							</button>
						</td>
						<td>{playerIndex === c.playerIndex && `•`}</td>
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
}
