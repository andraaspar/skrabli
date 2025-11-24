<script setup lang="ts">
import { jsonClone } from '../fun/jsonClone'
import { loadHints } from '../fun/loadHints'
import type { IWordPlans } from '../model/IWordPlans'
import { useGameStore } from '../store/useGameStore'
import verticalIcon from 'bootstrap-icons/icons/arrow-down-square.svg?raw'
import horizontalIcon from 'bootstrap-icons/icons/arrow-right-square.svg?raw'
import stopwatchIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import { computed, ref, watch } from 'vue'
import DialogBodyComp from './DialogBodyComp.vue'
import DialogComp from './DialogComp.vue'
import DialogHeaderComp from './DialogHeaderComp.vue'
import ErrorComp from './ErrorComp.vue'
import IconComp from './IconComp.vue'

const props = defineProps<{ isOpen: boolean }>()
const isOpen = computed(() => props.isOpen)

defineEmits(['close'])

const gameStore = useGameStore()

const hints = ref<IWordPlans | null>(null)
const hintsError = ref<string | null>(null)
const hintsTexts = computed(() => {
	if (hints.value == null) return { horizontal: '', vertical: '' }
	return {
		horizontal: hints.value.horizontal.map((it) => it.word).join(', '),
		vertical: hints.value.vertical.map((it) => it.word).join(', '),
	}
})

async function load() {
	try {
		hints.value = null
		hintsError.value = null
		hints.value = await loadHints({
			board: jsonClone(gameStore.state.board),
			boardSize: jsonClone(gameStore.state.boardSize),
			hand: jsonClone(gameStore.hand!),
		})
	} catch (e) {
		console.error(`[rx9sem]`, e)
		hintsError.value = e + ''
	}
}

watch(
	[isOpen, gameStore.state.board, gameStore.state.boardSize, gameStore.hand],
	() => {
		if (isOpen.value) {
			load()
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
