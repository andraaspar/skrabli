import { range } from 'illa/ArrayUtil'
import { withInterface } from 'illa/Type'

export interface IPlayer {
	name: string
	score: number
}

export type TPlayers = ReadonlyArray<IPlayer>

export function createPlayers(): TPlayers {
	return range(2).map(_ =>
		withInterface<IPlayer>({
			name: `${_ + 1}. Játékos`,
			score: 0,
		}),
	)
}
