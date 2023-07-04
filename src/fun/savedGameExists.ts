import { LocalStorageKey } from '../model/LocalStorageKey'
import { getNoError } from './getNoError'

export function savedGameExists() {
	return !!getNoError(false, () => localStorage[LocalStorageKey.SavedGame])
}
