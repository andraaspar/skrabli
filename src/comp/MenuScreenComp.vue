<script setup lang="ts">
import { savedGameExists } from '@/fun/savedGameExists'
import { Mode } from '@/model/Mode'
import { useStore } from '@/store/useStore'
import { useRouter } from 'vue-router'
import IconComp from './IconComp.vue'
import playIcon from 'bootstrap-icons/icons/play-circle-fill.svg?raw'
import starIcon from 'bootstrap-icons/icons/star-fill.svg?raw'
import { useLoadAllWordsValidity } from '@/fun/useLoadAllWordsValidity'
import { getNoError } from '@/fun/getNoError'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import ErrorComp from './ErrorComp.vue'
import { ref } from 'vue'

const store = useStore()
const router = useRouter()

function continueGame() {
	if (store.mode === Mode.NotStarted) {
		store.loadGame()
	}
	goToGameScreen()
}

function startNewGame() {
	store.newGame()
	goToGameScreen()
}

function goToGameScreen() {
	router.push({ name: 'game' })
}

const allWordsValidityUpdated = ref(
	getNoError(Infinity, () =>
		parseInt(localStorage[LocalStorageKey.AllWordsValidityUpdated] ?? '0', 10),
	),
)

function onSuccess() {
	allWordsValidityUpdated.value = Date.now()
}
const {
	loadAllWordsValidity,
	loadAllWordsValidityError,
	loadAllWordsValidityIsLoading,
	loadAllWordsValidityIcon,
	loadAllWordsValidityLabel,
} = useLoadAllWordsValidity(onSuccess)
</script>

<template>
	<div class="screen">
		<div class="menu">
			<button
				v-if="store.mode !== Mode.NotStarted || savedGameExists()"
				@click="continueGame"
			>
				<IconComp :icon="playIcon" color="#0bd" /> Folytatás
			</button>
			<button @click="startNewGame">
				<IconComp :icon="starIcon" color="#fc0" /> Új játék
			</button>
			<ErrorComp :error="loadAllWordsValidityError" />
			<button
				v-if="allWordsValidityUpdated < Date.now() - 1000 * 60 * 60 * 24 * 30"
				@click="loadAllWordsValidity"
				:disabled="loadAllWordsValidityIsLoading"
			>
				<IconComp :icon="loadAllWordsValidityIcon" />
				{{ loadAllWordsValidityLabel }}
			</button>
		</div>
	</div>
</template>

<style scoped>
.menu {
	display: flex;
	flex-flow: column;
	padding: var(--gap);
	gap: var(--gap);
	margin: auto;
}
</style>
