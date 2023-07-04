<script setup lang="ts">
import { useStore } from '@/store/useStore'
import HintsWorker from '@/hints.worker?worker'
import type { IWordPlans } from '@/model/IWordPlans'
import { computed, ref, watch, unref } from 'vue'
import DialogComp from './DialogComp.vue'
import { jsonClone } from '@/fun/jsonClone'

const props = defineProps<{ isOpen: boolean }>()
const isOpen = computed(() => props.isOpen)

defineEmits(['close'])

const store = useStore()

let worker: Worker | null = null
const hints = ref<IWordPlans | null>(null)
const hintsTexts = computed(() => {
	if (hints.value == null) return { horizontal: '', vertical: '' }
	return {
		horizontal: hints.value.horizontal.map((it) => it.word).join(', '),
		vertical: hints.value.vertical.map((it) => it.word).join(', '),
	}
})

async function loadHints() {
	try {
		hints.value = await new Promise<IWordPlans>((resolve, reject) => {
			hints.value = null
			if (worker) worker.terminate()
			worker = new HintsWorker()
			worker.addEventListener('message', (event) => {
				resolve(event.data)
			})
			worker.addEventListener('error', (event) => {
				reject(event)
			})
			worker.postMessage({
				hand: jsonClone(store.hand),
				board: jsonClone(store.board),
			})
		})
	} catch (e) {
		console.error(`[rx9sem]`, e)
	} finally {
		worker?.terminate()
		worker = null
	}
}

watch([isOpen, store.board, store.hand], () => {
	if (isOpen.value) {
		loadHints()
	}
})
</script>

<template>
	<DialogComp :isOpen="isOpen">
		<div class="result">
			<template v-if="hints == null">⌚</template>
			<template v-else>
				<div class="title">Vízszintes</div>
				<div>{{ hintsTexts.horizontal || '‑' }}</div>
				<div class="title">Függőleges</div>
				<div>{{ hintsTexts.vertical || '‑' }}</div>
			</template>
		</div>
		<div>
			<button @click="$emit('close')">Zárd be</button>
		</div>
	</DialogComp>
</template>

<style scoped>
.result {
	display: flex;
	flex-flow: column;
	gap: 2vmin;
}
.title {
	font-weight: bold;
}
</style>
