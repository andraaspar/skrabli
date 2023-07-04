<script setup lang="ts">
import { loadWordsValidity } from '@/fun/loadWordsValidity'
import { Mode } from '@/model/Mode'
import { QueryKey } from '@/model/QueryKey'
import { useStore } from '@/store/useStore'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import ButtonsComp from './ButtonsComp.vue'
import HintsComp from './HintsComp.vue'

defineEmits(['setJokerLetter'])

const store = useStore()

const queryKey = computed(() => [
	QueryKey.AreWordsValid,
	store.allOwnedWordStrings,
])
function queryFn() {
	return loadWordsValidity(store.allOwnedWordStrings)
}
const {
	data: validity,
	isLoading,
	isError,
} = useQuery({
	queryKey: queryKey,
	queryFn: queryFn,
})

const okButtonDisabled = computed(() => {
	return (
		store.moveErrors.length > 0 ||
		isLoading.value ||
		isError.value ||
		validity.value!.invalidWords.length > 0
	)
})
const okButtonLabel = computed(() => {
	if (isLoading.value) return '⌚'
	if (isError.value) return '❌ Hiba!'
	return '✅ Oké'
})

function swapTiles() {
	store.collectTiles()
	store.setMode(Mode.ReplaceTiles)
}

function skip() {
	if (window.confirm(`Biztos hogy nem teszel semmit?`)) {
		store.skip()
	}
}

function newGame() {
	if (window.confirm(`Biztos hogy új játékot akarsz kezdeni?`)) {
		store.newGame()
	}
}

const hintsAreOpen = ref(false)

function showHints() {
	store.collectTiles()
	hintsAreOpen.value = true
}

function done() {
	store.score()
	store.disownTiles()
	store.resetSkipCount()
	if (store.bag.length || store.handCount) {
		store.fillHand()
		store.nextPlayer()
		store.saveGame()
	} else {
		store.endGame()
	}
}
</script>

<template>
	<ButtonsComp>
		<button :disabled="okButtonDisabled" @click="done">
			{{ okButtonLabel
			}}<span v-if="store.moveScore > 0" class="score"
				>: {{ store.moveScore }}&nbsp;pont</span
			></button
		><button @click="store.collectTiles">⏏ Szedd össze</button
		><button :disabled="store.bag.length < 7" @click="swapTiles">
			🔄&nbsp;Csere</button
		><button @click="skip">💁‍♀️ Kihagyom</button
		><button @click="newGame">⭐ Új játék</button
		><button v-if="store.hand" @click="showHints">🪄 Tipp</button
		><button
			v-if="store.tile?.isOwned && store.tile.isJoker"
			@click="$emit('setJokerLetter')"
		>
			✍️ Átírom a lapka betűjét</button
		><HintsComp :isOpen="hintsAreOpen" @close="hintsAreOpen = false" />
	</ButtonsComp>
</template>

<style scoped></style>
