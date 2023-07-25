import { defineStore } from 'pinia'

interface IUiState {
	lockedCount: number
	error: string
	updateServiceWorker: undefined | (() => Promise<void>)
	offlineReady: boolean
}

export const useUiStore = defineStore('ui', {
	state: (): IUiState => ({
		lockedCount: 0,
		error: '',
		updateServiceWorker: undefined,
		offlineReady: false,
	}),
	getters: {
		isLocked(): boolean {
			return this.lockedCount > 0
		},
	},
	actions: {
		async lockWhile(fn: () => Promise<void>) {
			try {
				this.lockedCount++
				await fn()
			} catch (e) {
				console.error(e)
				this.error = e + ''
			} finally {
				this.lockedCount--
			}
		},
	},
})

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
// }
