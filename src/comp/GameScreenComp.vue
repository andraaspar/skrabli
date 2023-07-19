<script setup lang="ts">
import { BINGO_SCORE } from '@/model/Constants'
import listSvg from 'bootstrap-icons/icons/list.svg?raw'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mode } from '../model/Mode'
import { useStore } from '../store/useStore'
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

const store = useStore()
const router = useRouter()

const showSetJokerLetter = ref(false)

if (store.mode === Mode.NotStarted) {
	router.replace({ name: 'menu' })
}
</script>

<template>
	<div class="screen">
		<div class="menu-row">
			<RouterLink class="button" :to="{ name: 'menu' }" replace>
				<IconComp :icon="listSvg"></IconComp>
			</RouterLink>
		</div>
		<BoardComp @setJokerLetter="showSetJokerLetter = true" />
		<div class="tools">
			<template v-if="store.mode === Mode.PlaceTile">
				<PlayersComp />
				<HandComp />
				<div v-if="store.isBingo" class="bingo">+{{ BINGO_SCORE }} pont!</div>
				<OwnWordInfoComp />
				<ErrorsComp />
				<PlaceTileButtonsComp @setJokerLetter="showSetJokerLetter = true" />
				<PlacedWordInfoComp />
			</template>
			<template v-else-if="store.mode === Mode.ReplaceTiles">
				<HandComp />
				<ReplaceTilesButtonsComp />
			</template>
			<template v-else-if="store.mode === Mode.Ended">
				<div class="result">
					<template v-if="store.isGameDrawn">Döntetlen!</template>
					<template v-else>{{ store.winnersNames }} győzött!</template>
				</div>
				<PlayersComp />
				<ButtonsComp>
					<RouterLink class="button" :to="{ name: 'menu' }">Oké</RouterLink>
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
.menu-row {
	display: flex;
	flex-flow: row wrap;
	padding: var(--gap);
	gap: var(--gap);
	height: fit-content;
	justify-content: flex-end;
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
