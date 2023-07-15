<script setup lang="ts">
import { savedGameExists } from '@/fun/savedGameExists'
import { BINGO_SCORE } from '@/model/Constants'
import { ref } from 'vue'
import { Mode } from '../model/Mode'
import { useStore } from '../store/useStore'
import BoardComp from './BoardComp.vue'
import ErrorsComp from './ErrorsComp.vue'
import GameEndedComp from './GameEndedComp.vue'
import HandComp from './HandComp.vue'
import OwnWordInfoComp from './OwnWordInfoComp.vue'
import PlaceTileButtonsComp from './PlaceTileButtonsComp.vue'
import PlacedWordInfoComp from './PlacedWordInfoComp.vue'
import PlayersComp from './PlayersComp.vue'
import ReplaceTilesButtonsComp from './ReplaceTilesButtonsComp.vue'
import SetJokerLetterComp from './SetJokerLetterComp.vue'
import listSvg from 'bootstrap-icons/icons/list.svg?raw'
import IconComp from './IconComp.vue'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const showSetJokerLetter = ref(false)

if (store.mode === Mode.NotStarted) {
	router.replace({ name: 'menu' })
}
</script>

<template>
	<div class="menu-row">
		<RouterLink class="button" :to="{ name: 'menu' }" replace
			><IconComp :icon="listSvg"></IconComp
		></RouterLink>
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
		<GameEndedComp v-else-if="store.mode === Mode.Ended" />
	</div>
	<SetJokerLetterComp
		:isOpen="showSetJokerLetter"
		@close="showSetJokerLetter = false"
	/>
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
</style>
