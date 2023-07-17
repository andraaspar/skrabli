import { LocalStorageKey } from '@/model/LocalStorageKey'
import { QueryKey } from '@/model/QueryKey'
import { useQueryClient } from '@tanstack/vue-query'
import refreshIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?raw'
import loadingIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import { computed, ref } from 'vue'
import { loadAllWordsValidityFromServer } from './loadAllWordsValidityFromServer'

export function useLoadAllWordsValidity(onSuccess?: () => void) {
	const queryClient = useQueryClient()

	const loadAllWordsValidityError = ref<unknown>()
	const loadAllWordsValidityIsLoading = ref<boolean>(false)
	async function loadAllWordsValidity() {
		try {
			loadAllWordsValidityError.value = undefined
			loadAllWordsValidityIsLoading.value = true
			await loadAllWordsValidityFromServer()
			try {
				localStorage[LocalStorageKey.AllWordsValidityUpdated] = Date.now()
			} catch (e) {
				// Ignore error
			}
			queryClient.invalidateQueries([QueryKey.AreWordsValid])
			await onSuccess?.()
		} catch (e) {
			console.error(`[rxwcsm]`, e)
			loadAllWordsValidityError.value = e
		} finally {
			loadAllWordsValidityIsLoading.value = false
		}
	}

	const loadAllWordsValidityLabel = computed(() => {
		if (loadAllWordsValidityIsLoading.value) {
			return ''
		}
		return 'Frissítsd a szódefiníciókat'
	})

	const loadAllWordsValidityIcon = computed(() => {
		if (loadAllWordsValidityIsLoading.value) {
			return loadingIcon
		}
		return refreshIcon
	})

	return {
		loadAllWordsValidityError,
		loadAllWordsValidityIsLoading,
		loadAllWordsValidity,
		loadAllWordsValidityLabel,
		loadAllWordsValidityIcon,
	}
}
