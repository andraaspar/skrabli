import { AiLevel } from '../model/AiLevel'

export function aiLevelToString(aiLevel: AiLevel): string {
	switch (aiLevel) {
		case AiLevel.Human:
			return `játékos`
		case AiLevel.Easy:
			return `könnyű robot`
		case AiLevel.Medium:
			return `közepes robot`
		case AiLevel.Hard:
			return `nehéz robot`
		case AiLevel.VeryHard:
			return `durva robot`
		case AiLevel.Ultimate:
			return `végső robot`
	}
}
