import { LocalStorageKey } from '@/model/LocalStorageKey'
import { QueryKey } from '@/model/QueryKey'
import { useUiStore } from '@/store/useUiStore'
import { useQueryClient } from '@tanstack/vue-query'
import { loadAllWordsValidityFromServer } from './loadAllWordsValidityFromServer'

export function useLoadAllWordsValidity(onSuccess?: () => void) {
	const queryClient = useQueryClient()
	const uiStore = useUiStore()

	async function loadAllWordsValidity() {
		await uiStore.lockWhile(async () => {
			await loadAllWordsValidityFromServer()
			queryClient.invalidateQueries([QueryKey.AreWordsValid])
			try {
				localStorage[LocalStorageKey.AllWordsValidityUpdated] = Date.now()
			} catch (e) {
				// Ignore error
			}
			await onSuccess?.()
		})
	}

	return {
		loadAllWordsValidity,
	}
}
