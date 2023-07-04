import './css/screen.css'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import AppComp from './comp/AppComp.vue'

const app = createApp(AppComp)

app.use(createPinia())
app.use(VueQueryPlugin)

app.mount('#app')
