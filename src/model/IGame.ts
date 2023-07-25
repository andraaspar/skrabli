import type { IGameState } from './IGameState'
import type { IPlayerInfo } from './IPlayerInfo'

export interface IGame {
	id: string
	name: string
	timestamp: number
	playerInfos: IPlayerInfo[]
	states: IGameState[]
}
