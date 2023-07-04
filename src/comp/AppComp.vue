<script setup lang="ts">
import { savedGameExists } from '@/fun/savedGameExists'
import { Mode } from '../model/Mode'
import { useStore } from '../store/useStore'
import BoardComp from './BoardComp.vue'
import PlayersComp from './PlayersComp.vue'
import HandComp from './HandComp.vue'
import OwnWordInfoComp from './OwnWordInfoComp.vue'
import ErrorsComp from './ErrorsComp.vue'
import { BINGO_SCORE } from '@/model/Constants'
import PlaceTileButtonsComp from './PlaceTileButtonsComp.vue'
import PlacedWordInfoComp from './PlacedWordInfoComp.vue'
import { useQueryClient } from '@tanstack/vue-query'
import ReplaceTilesButtonsComp from './ReplaceTilesButtonsComp.vue'
import GameEndedComp from './GameEndedComp.vue'
import ButtonsComp from './ButtonsComp.vue'
import { ref } from 'vue'
import SetJokerLetterComp from './SetJokerLetterComp.vue'

const store = useStore()

const queryClient = useQueryClient()
queryClient.setQueryDefaults([], {
	staleTime: Infinity,
	refetchOnMount: false,
	refetchOnWindowFocus: false,
	refetchOnReconnect: false,
	cacheTime: Infinity,
})

const showSetJokerLetter = ref(false)
</script>

<template>
	<BoardComp @setJokerLetter="showSetJokerLetter = true" />
	<div class="tools">
		<ButtonsComp v-if="store.mode === Mode.NotStarted">
			<button v-if="savedGameExists()" @click="store.loadGame">
				▶️ Folytatás</button
			><button @click="store.newGame">⭐ Új játék</button>
		</ButtonsComp>
		<template v-else-if="store.mode === Mode.PlaceTile">
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
.tools {
	flex: 0 0 auto;
}

.bingo {
	font-weight: bold;
	color: hotpink;
}
</style>
