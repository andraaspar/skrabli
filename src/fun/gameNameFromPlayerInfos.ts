import { AiLevel } from '@/model/AiLevel'
import type { IPlayerInfo, IPlayerInfo1 } from '@/model/IPlayerInfo'
import { isString } from './isString'
import { listed } from './listed'

export function gameNameFromPlayerInfos(
	playerInfos: (IPlayerInfo | IPlayerInfo1)[],
): string {
	const humans = playerInfos.filter((p) => p.aiLevel === AiLevel.Human)
	const easyBots = playerInfos.filter((p) => p.aiLevel === AiLevel.Easy)
	const mediumBots = playerInfos.filter((p) => p.aiLevel === AiLevel.Medium)
	const hardBots = playerInfos.filter((p) => p.aiLevel === AiLevel.Hard)
	const veryHardBots = playerInfos.filter((p) => p.aiLevel === AiLevel.VeryHard)
	const ultimateBots = playerInfos.filter((p) => p.aiLevel === AiLevel.Ultimate)
	const botsStringBase = [
		easyBots.length > 0 && `${easyBots.length} könnyű`,
		mediumBots.length > 0 && `${mediumBots.length} közepes`,
		hardBots.length > 0 && `${hardBots.length} nehéz`,
		veryHardBots.length > 0 && `${hardBots.length} durva`,
		ultimateBots.length > 0 && `${ultimateBots.length} végső`,
	].filter(isString)
	const botsString =
		botsStringBase.length === 0
			? ''
			: ' ' + listed(botsStringBase) + ` robot ellen`
	return listed(humans.map((human) => human.name)) + botsString
}
