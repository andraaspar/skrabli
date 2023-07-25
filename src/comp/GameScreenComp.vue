<script setup lang="ts">
import { BINGO_SCORE } from '@/model/Constants'
import listSvg from 'bootstrap-icons/icons/list.svg?raw'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mode } from '../model/Mode'
import { useGameStore } from '../store/useGameStore'
import BoardComp from './BoardComp.vue'
import ErrorsComp from './ErrorsComp.vue'
import HandComp from './HandComp.vue'
import IconComp from './IconComp.vue'
import OwnWordInfoComp from './OwnWordInfoComp.vue'
import PlaceTileButtonsComp from './PlaceTileButtonsComp.vue'
import PlacedWordInfoComp from './PlacedWordInfoComp.vue'
import PlayersComp from './PlayersComp.vue'
import ReplaceTilesButtonsComp from './ReplaceTilesButtonsComp.vue'
import SetJokerLetterComp from './SetJokerLetterComp.vue'
import ButtonsComp from './ButtonsComp.vue'
import logoSvg from '../asset/logo.svg?raw'
import { deleteGameFromDb } from '@/fun/deleteGameFromDb'
import { useUiStore } from '@/store/useUiStore'

const gameStore = useGameStore()
const uiStore = useUiStore()
const router = useRouter()

const showSetJokerLetter = ref(false)

if (gameStore.state.mode === Mode.NotStarted) {
	router.replace({ name: 'menu' })
}

async function endGame() {
	await uiStore.lockWhile(async () => {
		deleteGameFromDb(gameStore.id)
	})
	gameStore.newGame()
	router.replace({ name: 'menu' })
}
</script>

<template>
	<div class="screen">
		<div class="menu-row">
			<IconComp :icon="logoSvg" class="logo" />
			<RouterLink class="button" :to="{ name: 'menu' }" replace>
				<IconComp :icon="listSvg"></IconComp>
			</RouterLink>
		</div>
		<BoardComp @setJokerLetter="showSetJokerLetter = true" />
		<div class="tools">
			<PlayersComp />
			<template v-if="gameStore.state.mode === Mode.PlaceTile">
				<HandComp />
				<div v-if="gameStore.isBingo" class="bingo">
					+{{ BINGO_SCORE }} pont!
				</div>
				<OwnWordInfoComp />
				<ErrorsComp />
				<PlaceTileButtonsComp @setJokerLetter="showSetJokerLetter = true" />
				<PlacedWordInfoComp />
			</template>
			<template v-else-if="gameStore.state.mode === Mode.ReplaceTiles">
				<HandComp />
				<ReplaceTilesButtonsComp />
			</template>
			<template v-else-if="gameStore.state.mode === Mode.Ended">
				<div class="result">
					<template v-if="gameStore.isGameDrawn">Döntetlen!</template>
					<template v-else>{{ gameStore.winnersNames }} győzött!</template>
				</div>
				<ButtonsComp>
					<button @click="endGame">Oké</button>
				</ButtonsComp>
			</template>
		</div>
		<SetJokerLetterComp
			:isOpen="showSetJokerLetter"
			@close="showSetJokerLetter = false"
		/>
	</div>
</template>

<style scoped>
.logo {
	width: 6vmin;
	height: 6vmin;
	transform: rotate(15deg);
}
.menu-row {
	display: flex;
	flex-flow: row wrap;
	padding: var(--gap);
	gap: var(--gap);
	height: fit-content;
	align-items: center;
	justify-content: space-between;
}

@media (aspect-ratio: 4 / 3) {
	.menu-row {
		justify-content: flex-start;
	}
}

.tools {
	flex: 0 1 100%;
}

.bingo {
	padding: 8vmin var(--gap);
	font-size: 1.5rem;
	color: hotpink;
	text-align: center;
}

.result {
	padding: 6vmin var(--gap);
	text-align: center;
	font-size: 6vmin;
	color: hotpink;
}
</style>
