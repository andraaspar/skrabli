import './css/screen.css'

import { registerSW } from 'virtual:pwa-register'
import { mutateState } from './c-mp/fun/useState'
import { AppComp } from './comp/AppComp'
import { migrateGameFromLocalStorage } from './fun/migrateGameFromLocalStorage'
import { uiStore } from './store/uiStore'

await uiStore.lockWhile('index [t6c2d9]', () => migrateGameFromLocalStorage())

document.getElementById('app')?.append(<AppComp />)

const updateServiceWorker = registerSW({
	onNeedRefresh() {
		mutateState(`index set updateServiceWorker [t6c9j3]`, () => {
			uiStore.updateServiceWorker = () => updateServiceWorker(true)
		})
	},
	onOfflineReady() {
		// Never seems to trigger
		// const uiStore = useUiStore()
		// uiStore.offlineReady = true
	},
})
