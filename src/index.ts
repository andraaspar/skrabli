import './css/screen.css'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import AppComp from './comp/AppComp.vue'
import GameScreenComp from './comp/GameScreenComp.vue'
import MenuScreenComp from './comp/MenuScreenComp.vue'
import NewGameScreenComp from './comp/NewGameScreenComp.vue'
import { useUiStore } from './store/useUiStore'

declare global {
	var BUILD_TIMESTAMP: string
}

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ name: 'menu', path: '/', component: MenuScreenComp },
		{ name: 'new', path: '/new', component: NewGameScreenComp },
		{ name: 'game', path: '/game', component: GameScreenComp },
	],
})

const app = createApp(AppComp)

app.use(router)
app.use(createPinia())
app.use(VueQueryPlugin)

app.mount('#app')

const updateServiceWorker = registerSW({
	onNeedRefresh() {
		const uiStore = useUiStore()
		uiStore.updateServiceWorker = { update: () => updateServiceWorker(true) }
	},
	onOfflineReady() {
		const uiStore = useUiStore()
		uiStore.offlineReady = true
	},
})
