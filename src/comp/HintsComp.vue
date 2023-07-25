<script setup lang="ts">
import { getKnownWords } from '@/fun/getKnownWords'
import { jsonClone } from '@/fun/jsonClone'
import HintsWorker from '@/hints.worker?worker'
import type { IWordPlans } from '@/model/IWordPlans'
import { useGameStore } from '@/store/useGameStore'
import verticalIcon from 'bootstrap-icons/icons/arrow-down-square.svg?raw'
import horizontalIcon from 'bootstrap-icons/icons/arrow-right-square.svg?raw'
import stopwatchIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import { computed, ref, watch } from 'vue'
import DialogComp from './DialogComp.vue'
import IconComp from './IconComp.vue'
import ErrorComp from './ErrorComp.vue'
import DialogHeaderComp from './DialogHeaderComp.vue'
import DialogBodyComp from './DialogBodyComp.vue'

const props = defineProps<{ isOpen: boolean }>()
const isOpen = computed(() => props.isOpen)

defineEmits(['close'])

const gameStore = useGameStore()

let worker: Worker | null = null
const hints = ref<IWordPlans | null>(null)
const hintsError = ref<string | null>(null)
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
		hintsError.value = null
		hints.value = await new Promise<IWordPlans>((resolve, reject) => {
			hints.value = null
			if (worker) worker.terminate()
			worker = new HintsWorker()
			worker.addEventListener('message', (event) => {
				// console.log(`[ryb95u]`, event.data)
				resolve(event.data)
			})
			worker.addEventListener('error', (event) => {
				reject(event.message)
			})
			worker.postMessage({
				hand: jsonClone(gameStore.hand),
				board: jsonClone(gameStore.state.board),
				boardSize: jsonClone(gameStore.state.boardSize),
				words: words,
			})
		})
	} catch (e) {
		console.error(`[rx9sem]`, e)
		hintsError.value = e + ''
	} finally {
		worker?.terminate()
		worker = null
	}
}

watch(
	[isOpen, gameStore.state.board, gameStore.state.boardSize, gameStore.hand],
	() => {
		if (isOpen.value) {
			loadHints()
		}
	},
)
</script>

<template>
	<DialogComp :isOpen="isOpen">
		<DialogHeaderComp @close="$emit('close')">Tipp</DialogHeaderComp>
		<DialogBodyComp>
			<div class="results">
				<ErrorComp v-if="!!hintsError" :error="hintsError" />
				<IconComp v-else-if="hints == null" :icon="stopwatchIcon" />
				<template v-else>
					<div class="result">
						<div class="title">
							<IconComp :icon="horizontalIcon" /> Vízszintes
						</div>
						<div>{{ hintsTexts.horizontal || '‑' }}</div>
					</div>
					<div class="result">
						<div class="title">
							<IconComp :icon="verticalIcon" /> Függőleges
						</div>
						<div>{{ hintsTexts.vertical || '‑' }}</div>
					</div>
				</template>
			</div>
		</DialogBodyComp>
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
