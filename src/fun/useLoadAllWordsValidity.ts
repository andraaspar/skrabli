import { activeComps } from '../c-mp/fun/defineComponent'
import { resetQueries } from '../c-mp/fun/useQuery'
import { LocalStorageKey } from '../model/LocalStorageKey'
import { QueryKey } from '../model/QueryKey'
import { uiStore } from '../store/uiStore'
import { loadAllWordsValidityFromServer } from './loadAllWordsValidityFromServer'

export function useLoadAllWordsValidity(onSuccess?: () => void) {
	async function loadAllWordsValidity() {
		await uiStore.lockWhile(
			(activeComps.at(-1)?.debugName ?? '') + ' loadAllWordsValidity [t6c2cx]',
			async () => {
				await loadAllWordsValidityFromServer()
				resetQueries(QueryKey.AreWordsValid)
				try {
					localStorage[LocalStorageKey.AllWordsValidityUpdated] = Date.now()
				} catch (e) {
					// Ignore error
				}
				await onSuccess?.()
			},
		)
	}

	return {
		loadAllWordsValidity,
	}
}
