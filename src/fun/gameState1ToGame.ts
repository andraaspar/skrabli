import { AiLevel } from '@/model/AiLevel'
import type { IGame } from '@/model/IGame'
import type { IGameState1 } from '@/model/IGameState'
import type { IPlayerInfo } from '@/model/IPlayerInfo'
import { v4 } from 'uuid'
import { gameNameFromPlayerInfos } from './gameNameFromPlayerInfos'

export function gameState1ToGame(gs1: IGameState1): IGame {
	const { players, ...gs1Rest } = gs1
	const playerInfos: IPlayerInfo[] = gs1.players.map((player) => ({
		aiLevel: AiLevel.Human,
		name: player.name,
	}))
	return {
		id: v4(),
		name: gameNameFromPlayerInfos(playerInfos),
		timestamp: Date.now(),
		playerInfos: playerInfos,
		states: [
			{
				...gs1Rest,
				playerScores: players.map((player) => player.score),
			},
		],
	}
}
