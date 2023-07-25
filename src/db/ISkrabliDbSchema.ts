import type { IGame } from '@/model/IGame'
import { type DBSchema } from 'idb'
import { type IWordsValidity } from '../model/IWordsValidity'

export interface ISkrabliDbSchema extends DBSchema {
	validity: {
		key: string
		value: IWordsValidity
	}
	games: {
		key: string
		value: IGame
		indexes: {
			byTimestamp: number
		}
	}
}
