<script setup lang="ts">
import { loadWordsValidity } from '@/fun/loadWordsValidity'
import { Mode } from '@/model/Mode'
import { QueryKey } from '@/model/QueryKey'
import { useGameStore } from '@/store/useGameStore'
import { useQuery } from '@tanstack/vue-query'
import changeIcon from 'bootstrap-icons/icons/arrow-down-up.svg?raw'
import skipIcon from 'bootstrap-icons/icons/arrow-right-square-fill.svg?raw'
import okIcon from 'bootstrap-icons/icons/check-circle-fill.svg?raw'
import collectIcon from 'bootstrap-icons/icons/eject-fill.svg?raw'
import errorIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'
import hintIcon from 'bootstrap-icons/icons/magic.svg?raw'
import stopwatchIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import notOkIcon from 'bootstrap-icons/icons/x-circle-fill.svg?raw'
import pencilSvg from 'bootstrap-icons/icons/pencil-fill.svg?raw'
import { computed, ref } from 'vue'
import ButtonsComp from './ButtonsComp.vue'
import HintsComp from './HintsComp.vue'
import IconComp from './IconComp.vue'

defineEmits(['setJokerLetter'])

const gameStore = useGameStore()

const queryKey = computed(() => [
	QueryKey.AreWordsValid,
	gameStore.allOwnedWordStrings,
])
function queryFn() {
	return loadWordsValidity(gameStore.allOwnedWordStrings)
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
		gameStore.moveErrors.length > 0 ||
		isLoading.value ||
		isError.value ||
		validity.value!.invalidWords.length > 0
	)
})
const okButtonLabel = computed(() => {
	if (isLoading.value) return ''
	if (isError.value) return ' Hiba!'
	if (okButtonDisabled.value) return ' Nem jó!'
	return ' Oké'
})
const okButtonIcon = computed(() => {
	if (isLoading.value) return stopwatchIcon
	if (isError.value) return errorIcon
	if (okButtonDisabled.value) return notOkIcon
	return okIcon
})
const okButtonIconColor = computed(() => {
	if (isLoading.value) return undefined
	if (isError.value) return '#f78'
	if (okButtonDisabled.value) return undefined
	return 'lightgreen'
})

function swapTiles() {
	gameStore.collectTiles()
	gameStore.setMode(Mode.ReplaceTiles)
}

function skip() {
	if (window.confirm(`Biztos hogy nem teszel semmit?`)) {
		gameStore.skip()
	}
}

const hintsAreOpen = ref(false)

function showHints() {
	gameStore.collectTiles()
	hintsAreOpen.value = true
}

function done() {
	gameStore.score()
	gameStore.disownTiles()
	gameStore.resetSkipCount()
	if (gameStore.state.bag.length || gameStore.handCount) {
		gameStore.fillHand()
		gameStore.nextPlayer()
		gameStore.setUndoPoint()
		gameStore.saveGame()
	} else {
		gameStore.endGame()
	}
}
</script>

<template>
	<ButtonsComp>
		<button :disabled="okButtonDisabled" @click="done">
			<IconComp :icon="okButtonIcon" :color="okButtonIconColor" />{{
				okButtonLabel
			}}<span v-if="gameStore.moveScore > 0" class="score"
				>: {{ gameStore.moveScore }}&nbsp;pont</span
			></button
		><button @click="gameStore.collectTiles">
			<IconComp :icon="collectIcon" color="#fd0" /> Szedd össze</button
		><button :disabled="gameStore.state.bag.length < 7" @click="swapTiles">
			<IconComp :icon="changeIcon" color="#0df" /> Csere</button
		><button @click="skip">
			<IconComp :icon="skipIcon" color="#f78" /> Kihagyom</button
		><button v-if="gameStore.hand" @click="showHints">
			<IconComp :icon="hintIcon" color="#f7f" /> Tipp</button
		><button
			v-if="gameStore.tile?.isOwned && gameStore.tile.isJoker"
			@click="$emit('setJokerLetter')"
		>
			<IconComp :icon="pencilSvg" color="#f60" /> Átírom a lapka betűjét</button
		><HintsComp :isOpen="hintsAreOpen" @close="hintsAreOpen = false" />
	</ButtonsComp>
</template>

<style scoped></style>
