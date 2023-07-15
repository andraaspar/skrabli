import './css/screen.css'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import AppComp from './comp/AppComp.vue'
import GameScreenComp from './comp/GameScreenComp.vue'
import MenuScreenComp from './comp/MenuScreenComp.vue'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ name: 'menu', path: '/', component: MenuScreenComp },
		{ name: 'game', path: '/game', component: GameScreenComp },
	],
})

const app = createApp(AppComp)

app.use(router)
app.use(createPinia())
app.use(VueQueryPlugin)

app.mount('#app')
