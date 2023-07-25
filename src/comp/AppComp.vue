<script setup lang="ts">
import { useUiStore } from '@/store/useUiStore'
import { useQueryClient } from '@tanstack/vue-query'
import DialogComp from './DialogComp.vue'
import IconComp from './IconComp.vue'
import loadingSvg from 'bootstrap-icons/icons/stopwatch.svg?raw'
import ErrorComp from './ErrorComp.vue'
import DialogHeaderComp from './DialogHeaderComp.vue'
import DialogBodyComp from './DialogBodyComp.vue'
import { onMounted, ref } from 'vue'
import { migrateGameFromLocalStorage } from '@/fun/migrateGameFromLocalStorage'

const queryClient = useQueryClient()
queryClient.setQueryDefaults([], {
	staleTime: Infinity,
	refetchOnMount: false,
	refetchOnWindowFocus: false,
	refetchOnReconnect: false,
	cacheTime: Infinity,
})

const uiStore = useUiStore()

const isMigrated = ref(false)

onMounted(async () => {
	if (!isMigrated.value) {
		await uiStore.lockWhile(() => migrateGameFromLocalStorage())
		isMigrated.value = true
	}
})
</script>

<template>
	<RouterView v-if="isMigrated" v-slot="{ Component }">
		<Transition appear>
			<Component :is="Component" />
		</Transition>
	</RouterView>
	<DialogComp :isOpen="!!uiStore.error">
		<DialogHeaderComp @close="uiStore.error = ''">Hiba!</DialogHeaderComp>
		<DialogBodyComp>
			<ErrorComp :error="uiStore.error" />
		</DialogBodyComp>
	</DialogComp>
	<DialogComp :isOpen="uiStore.isLocked || !isMigrated">
		<IconComp :icon="loadingSvg" />
	</DialogComp>
</template>
