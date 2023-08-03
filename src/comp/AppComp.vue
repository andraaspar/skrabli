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
import ButtonsComp from './ButtonsComp.vue'
import okIcon from 'bootstrap-icons/icons/check-circle-fill.svg?raw'
import cancelIcon from 'bootstrap-icons/icons/x-circle.svg?raw'

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

function acceptConfirm() {
	try {
		uiStore.confirm?.ok()
	} catch (e) {
		console.error(e)
	}
	uiStore.confirm = undefined
}

function cancelConfirm() {
	uiStore.confirm = undefined
}
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
	<DialogComp :isOpen="uiStore.isLocked || !isMigrated" :openDelay="1">
		<IconComp :icon="loadingSvg" />
	</DialogComp>
	<DialogComp :isOpen="!!uiStore.confirm">
		<DialogHeaderComp @close="cancelConfirm">{{
			uiStore.confirm?.title
		}}</DialogHeaderComp>
		<DialogBodyComp>
			<div class="message">{{ uiStore.confirm?.message }}</div>
			<ButtonsComp>
				<button @click="acceptConfirm" class="green">
					<IconComp :icon="okIcon" /> Rendben
				</button>
				<button @click="cancelConfirm" class="red">
					<IconComp :icon="cancelIcon" /> Mégse
				</button>
			</ButtonsComp>
		</DialogBodyComp>
	</DialogComp>
</template>

<style scoped>
.message {
	white-space: pre-wrap;
}
</style>
