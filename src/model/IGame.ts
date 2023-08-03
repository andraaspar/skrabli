import type { IGameState } from './IGameState'
import type { IPlayerInfo, IPlayerInfo1 } from './IPlayerInfo'

export interface IGame1 {
	id: string
	name: string
	timestamp: number
	playerInfos: IPlayerInfo1[]
	states: IGameState[]
}

export interface IGame {
	version: 2
	id: string
	name: string
	timestamp: number
	playerInfos: IPlayerInfo[]
	states: IGameState[]
}
