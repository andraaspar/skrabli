import type { AiLevel } from './AiLevel'

export interface IPlayerInfo1 {
	name: string
	aiLevel: AiLevel
}

export interface IPlayerInfo {
	name: string
	aiLevel: AiLevel
	hints: number
}
