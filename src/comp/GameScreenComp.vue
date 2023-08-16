<script setup lang="ts">
import { BINGO_SCORE } from '@/model/Constants'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mode } from '../model/Mode'
import { useGameStore } from '../store/useGameStore'
import BoardComp from './BoardComp.vue'
import ErrorsComp from './ErrorsComp.vue'
import HandComp from './HandComp.vue'
import OwnWordInfoComp from './OwnWordInfoComp.vue'
import PlaceTileButtonsComp from './PlaceTileButtonsComp.vue'
import PlacedWordInfoComp from './PlacedWordInfoComp.vue'
import PlayerComp from './PlayerComp.vue'
import ReplaceTilesButtonsComp from './ReplaceTilesButtonsComp.vue'
import SetJokerLetterComp from './SetJokerLetterComp.vue'
import ButtonsComp from './ButtonsComp.vue'
import { deleteGameFromDb } from '@/fun/deleteGameFromDb'
import { useUiStore } from '@/store/useUiStore'
import PlayersComp from './PlayersComp.vue'
import HeaderComp from './HeaderComp.vue'
import { loadContinuableGame } from '@/fun/loadContinuableGame'

const gameStore = useGameStore()
const uiStore = useUiStore()
const router = useRouter()

const showSetJokerLetter = ref(false)

if (!gameStore.started) {
	uiStore.lockWhile(async () => {
		const game = await loadContinuableGame()
		if (game) {
			gameStore.$patch(game)
		} else {
			router.replace({ name: 'menu' })
		}
	})
}

async function endGame() {
	await uiStore.lockWhile(async () => {
		deleteGameFromDb(gameStore.id)
	})
	gameStore.$reset()
	router.replace({ name: 'menu' })
}
</script>

<template>
	<div class="screen">
		<HeaderComp>{{ gameStore.name }}</HeaderComp>
		<template v-if="gameStore.started">
			<BoardComp @setJokerLetter="showSetJokerLetter = true" />
			<div class="tools">
				<template v-if="gameStore.state.mode === Mode.PlaceTile">
					<PlayerComp />
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
					<PlayerComp />
					<HandComp />
					<ReplaceTilesButtonsComp />
				</template>
				<template v-else-if="gameStore.state.mode === Mode.Ended">
					<div class="result">
						<template v-if="gameStore.isGameDrawn">Döntetlen!</template>
						<template v-else>{{ gameStore.winnersNames }} győzött!</template>
					</div>
					<PlayersComp />
					<ButtonsComp>
						<button @click="endGame">Oké</button>
					</ButtonsComp>
				</template>
			</div>
			<SetJokerLetterComp
				:isOpen="showSetJokerLetter"
				@close="showSetJokerLetter = false"
			/>
		</template>
	</div>
</template>

<style scoped>
.tools {
	flex: 0 1 100%;
	display: flex;
	flex-flow: column;
	gap: var(--gap);
}

@media (aspect-ratio >= 16/10) {
	.tools {
		overflow: auto;
	}
}

.bingo {
	font-size: 1.5rem;
	color: hotpink;
	text-align: center;
}

.result {
	text-align: center;
	font-size: 6vmin;
	color: hotpink;
}
</style>
