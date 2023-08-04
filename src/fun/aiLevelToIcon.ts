import { AiLevel } from '@/model/AiLevel'
import cpuFullIcon from 'bootstrap-icons/icons/cpu-fill.svg?raw'
import cpuIcon from 'bootstrap-icons/icons/cpu.svg?raw'
import personIcon from 'bootstrap-icons/icons/person-fill.svg?raw'

export function aiLevelToIcon(aiLevel: AiLevel): string {
	switch (aiLevel) {
		case AiLevel.Human:
			return personIcon
		case AiLevel.Easy:
		case AiLevel.Medium:
		case AiLevel.Hard:
		case AiLevel.VeryHard:
			return cpuIcon
		case AiLevel.Ultimate:
			return cpuFullIcon
	}
}
