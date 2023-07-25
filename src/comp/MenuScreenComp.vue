<script setup lang="ts">
import { getNoError } from '@/fun/getNoError'
import { loadGame } from '@/fun/loadGame'
import { useLoadAllWordsValidity } from '@/fun/useLoadAllWordsValidity'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import { Mode } from '@/model/Mode'
import { useGameStore } from '@/store/useGameStore'
import { useUiStore } from '@/store/useUiStore'
import refreshIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?raw'
import playIcon from 'bootstrap-icons/icons/play-circle-fill.svg?raw'
import starIcon from 'bootstrap-icons/icons/star-fill.svg?raw'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import logoSvg from '../asset/logo.svg?raw'
import IconComp from './IconComp.vue'
import type { TGameInfo } from '@/model/TGameInfo'
import { loadGameInfos } from '@/fun/loadGameInfos'

const gameStore = useGameStore()
const uiStore = useUiStore()
const router = useRouter()

async function continueGame() {
	if (gameStore.state.mode === Mode.NotStarted) {
		const gameId = localStorage[LocalStorageKey.LastGameId]
		if (gameId) {
			uiStore.lockWhile(async () => {
				const game = await loadGame(gameId)
				if (!game) throw new Error(`[ry5mal] Game not found!`)
				gameStore.$patch(game)
			})
		}
	}
	if (gameStore.state.mode !== Mode.NotStarted) {
		router.push({ name: 'game' })
	}
}

function continueableGameExists() {
	return !!getNoError(false, () => localStorage[LocalStorageKey.LastGameId])
}

function startNewGame() {
	gameStore.newGame()
	gameStore.startGame()
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
const { loadAllWordsValidity } = useLoadAllWordsValidity(onSuccess)

const gameInfos = ref<TGameInfo[] | undefined>(undefined)
onMounted(() => {
	uiStore.lockWhile(async () => {
		gameInfos.value = await loadGameInfos()
	})
})

async function loadGameById(id: string) {
	await uiStore.lockWhile(async () => {
		const game = await loadGame(id)
		if (!game) throw new Error(`[ryb06t] Game not found!`)
		gameStore.$patch(game)
	})
	router.push({ name: 'game' })
}
</script>

<template>
	<div class="screen">
		<div class="menu" v-if="gameInfos != null">
			<IconComp :icon="logoSvg" class="logo" />
			<div
				class="menu-buttons"
				v-if="
					gameStore.state.mode !== Mode.NotStarted || continueableGameExists()
				"
			>
				<button @click="continueGame">
					<IconComp :icon="playIcon" color="#0bd" /> Folytatás
				</button>
			</div>
			<div class="menu-buttons" v-if="gameInfos.length > 0">
				<button
					v-for="gameInfo of gameInfos"
					:key="gameInfo.id"
					@click="loadGameById(gameInfo.id)"
				>
					{{ gameInfo.name }}
				</button>
			</div>
			<div class="menu-buttons">
				<button @click="startNewGame">
					<IconComp :icon="starIcon" color="#fc0" /> Új játék
				</button>
			</div>
			<div class="menu-buttons">
				<button
					v-if="allWordsValidityUpdated < Date.now() - 1000 * 60 * 60 * 24 * 30"
					@click="loadAllWordsValidity"
				>
					<IconComp :icon="refreshIcon" />
					Frissítsd a szavakat
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.logo {
	width: 16vmin;
	height: 16vmin;
	margin: 0 auto;
	transform: rotate(15deg) translateY(-4vmin);
}
.menu {
	display: flex;
	flex-flow: column;
	padding: 8vmin;
	gap: 4vmin;
	margin: auto;
}
.menu-buttons {
	display: flex;
	flex-flow: column;
	padding: var(--gap);
	gap: var(--gap);
}
</style>
