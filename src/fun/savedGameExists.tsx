import { get } from 'illa/FunctionUtil'
import { LocalStorageKey } from '../model/LocalStorageKey'

export function savedGameExists() {
	return !!get(() => localStorage[LocalStorageKey.SavedGame])
}
