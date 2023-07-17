<script setup lang="ts">
import { getKnownWords } from '@/fun/getKnownWords'
import { jsonClone } from '@/fun/jsonClone'
import HintsWorker from '@/hints.worker?worker'
import type { IWordPlans } from '@/model/IWordPlans'
import { useStore } from '@/store/useStore'
import verticalIcon from 'bootstrap-icons/icons/arrow-down-square.svg?raw'
import horizontalIcon from 'bootstrap-icons/icons/arrow-right-square.svg?raw'
import stopwatchIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import { computed, ref, watch } from 'vue'
import DialogComp from './DialogComp.vue'
import IconComp from './IconComp.vue'

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
		const words = await getKnownWords()
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
				words: words,
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
		<div class="results">
			<IconComp v-if="hints == null" :icon="stopwatchIcon"></IconComp>
			<template v-else>
				<div class="result">
					<div class="title">
						<IconComp :icon="horizontalIcon" /> Vízszintes
					</div>
					<div>{{ hintsTexts.horizontal || '‑' }}</div>
				</div>
				<div class="result">
					<div class="title"><IconComp :icon="verticalIcon" /> Függőleges</div>
					<div>{{ hintsTexts.vertical || '‑' }}</div>
				</div>
			</template>
		</div>
		<div>
			<button @click="$emit('close')">Zárd be</button>
		</div>
	</DialogComp>
</template>

<style scoped>
.results {
	display: flex;
	flex-flow: column;
	align-items: center;
	gap: 4vmin;
}
.result {
	display: flex;
	flex-flow: column;
	gap: 2vmin;
}
.title {
	font-weight: bold;
}
</style>
