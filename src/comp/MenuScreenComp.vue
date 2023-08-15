<script setup lang="ts">
import { deleteGameFromDb } from '@/fun/deleteGameFromDb'
import { getNoError } from '@/fun/getNoError'
import { loadGame } from '@/fun/loadGame'
import { loadGameInfos } from '@/fun/loadGameInfos'
import { useLoadAllWordsValidity } from '@/fun/useLoadAllWordsValidity'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import type { TGameInfo } from '@/model/TGameInfo'
import { useGameStore } from '@/store/useGameStore'
import { useUiStore } from '@/store/useUiStore'
import refreshIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?raw'
import updateIcon from 'bootstrap-icons/icons/arrow-up-square-fill.svg?raw'
import infoIcon from 'bootstrap-icons/icons/info-circle-fill.svg?raw'
import playIcon from 'bootstrap-icons/icons/play-circle-fill.svg?raw'
import starIcon from 'bootstrap-icons/icons/star-fill.svg?raw'
import deleteIcon from 'bootstrap-icons/icons/x-circle.svg?raw'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import logoSvg from '../asset/logo.svg?raw'
import IconComp from './IconComp.vue'
import ButtonsComp from './ButtonsComp.vue'

const gameStore = useGameStore()
const uiStore = useUiStore()
const router = useRouter()

async function continueGame() {
	if (!gameStore.started) {
		const gameId = localStorage[LocalStorageKey.LastGameId]
		if (gameId) {
			await uiStore.lockWhile(async () => {
				const game = await loadGame(gameId)
				if (!game) throw new Error(`[ry5mal] Game not found!`)
				gameStore.$patch(game)
			})
		}
	}
	if (gameStore.started) {
		router.push({ name: 'game' })
	}
}

function continueableGameExists() {
	return !!getNoError(false, () => localStorage[LocalStorageKey.LastGameId])
}

function startNewGame() {
	router.push({ name: 'new' })
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

function getGameTitleById(id: string): string {
	if (!gameInfos.value) return ''
	const gameInfo = gameInfos.value.find((it) => it.id === id)
	return gameInfo?.name ?? ''
}

async function deleteGameById(id: string) {
	uiStore.confirm = {
		title: `Törlés`,
		message: `Biztosan töröljem a játékot?\n${getGameTitleById(id)}`,
		ok: async () => {
			await uiStore.lockWhile(async () => {
				await deleteGameFromDb(id)
				gameInfos.value = await loadGameInfos()
			})
			if (gameStore.id === id) {
				gameStore.$reset()
			}
		},
	}
}

async function update() {
	if (uiStore.updateServiceWorker) {
		await uiStore.lockWhile(uiStore.updateServiceWorker.update)
	}
}

const buildTimestamp = BUILD_TIMESTAMP

function wordsValidityExpired() {
	return allWordsValidityUpdated.value < Date.now() - 1000 * 60 * 60 * 24 * 30
}
</script>

<template>
	<div class="screen">
		<template v-if="gameInfos != null">
			<div class="menu-and-top">
				<div class="top-buttons">
					<button
						:class="{ green: true, hidden: !uiStore.updateServiceWorker }"
						@click="update"
						:disabled="!uiStore.updateServiceWorker"
					>
						<IconComp :icon="updateIcon" /> Frissítsd az alkalmazást
					</button>
				</div>
				<div class="menu">
					<IconComp :icon="logoSvg" class="logo" />
					<ButtonsComp v-if="gameStore.started || continueableGameExists()">
						<button @click="continueGame">
							<IconComp :icon="playIcon" color="lch(80 100 260)" /> Folytatás
						</button>
					</ButtonsComp>
					<div class="menu-buttons" v-if="gameInfos.length > 0">
						<div
							class="button-row"
							v-for="gameInfo of gameInfos"
							:key="gameInfo.id"
						>
							<button class="flex" @click="loadGameById(gameInfo.id)">
								{{ gameInfo.name }}
							</button>
							<button @click="deleteGameById(gameInfo.id)">
								<IconComp :icon="deleteIcon" color="lch(80 100 30)" />
							</button>
						</div>
					</div>
					<ButtonsComp>
						<button @click="startNewGame">
							<IconComp :icon="starIcon" color="lch(80 100 70)" /> Új játék
						</button>
					</ButtonsComp>
					<ButtonsComp>
						<button
							:class="{ hidden: wordsValidityExpired }"
							@click="loadAllWordsValidity"
							:disabled="wordsValidityExpired"
						>
							<IconComp :icon="refreshIcon" color="#5f3" />
							Frissítsd a szavakat
						</button>
					</ButtonsComp>
					<div :class="{ remark: true, hidden: !uiStore.offlineReady }">
						<IconComp :icon="infoIcon" /> Internet nélkül is működöm!
					</div>
				</div>
			</div>
			<div class="version">Verzió: {{ buildTimestamp }}</div>
		</template>
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
	flex: 0 0 auto;
	display: flex;
	flex-flow: column;
	padding: 8vmin 8vmin 16vmin;
	gap: 4vmin;
	margin: auto;
}
.menu-buttons {
	display: flex;
	flex-flow: column;
	gap: var(--gap);
}
.button-row {
	display: flex;
	gap: var(--gap);
}

.top-buttons {
	flex: 0 0 auto;
	display: flex;
	flex-flow: column;
	padding: 8vmin;
	gap: var(--gap);
}

.menu-and-top {
	flex: 1 0 auto;
	display: flex;
	flex-flow: column;
}

.remark {
	color: #ffffff55;
	padding: 0 var(--button-padding);
	text-align: center;
	transition: 0.5s;
}

.remark.hidden {
	opacity: 0;
}

.version {
	flex: 0 0 auto;
	color: #ffffff55;
	padding: var(--button-padding);
	text-align: center;
	font-size: 0.8em;
}

.flex {
	flex: 1 1 auto;
}

@media (aspect-ratio >= 16/10) {
	.version {
		writing-mode: vertical-lr;
		writing-mode: sideways-lr;
	}
}
</style>
