import { AiLevel } from '@/model/AiLevel'

export function aiLevelToColor(aiLevel: AiLevel): string {
	switch (aiLevel) {
		case AiLevel.Human:
			return `lch(80 100 180)`
		case AiLevel.Easy:
			return `lch(80 100 120)`
		case AiLevel.Medium:
			return `lch(80 100 60)`
		case AiLevel.Hard:
			return `lch(80 100 20)`
		case AiLevel.VeryHard:
		case AiLevel.Ultimate:
			return `lch(80 100 320)`
	}
}
