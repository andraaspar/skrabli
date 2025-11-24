import { getNoError } from '../fun/getNoError'
import { LocalStorageKey } from '../model/LocalStorageKey'

export function continueableGameExists() {
	return !!getNoError(false, () => localStorage[LocalStorageKey.LastGameId])
}
