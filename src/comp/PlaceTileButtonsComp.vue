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
import pencilSvg from 'bootstrap-icons/icons/pencil-fill.svg?raw'
import stopwatchIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import notOkIcon from 'bootstrap-icons/icons/x-circle-fill.svg?raw'
import { computed, ref } from 'vue'
import ButtonsComp from './ButtonsComp.vue'
import HintsComp from './HintsComp.vue'
import IconComp from './IconComp.vue'
import { useUiStore } from '@/store/useUiStore'
import { MAX_SKIP_PER_PLAYER } from '@/model/MAX_SKIP_PER_PLAYER'

defineEmits(['setJokerLetter'])

const gameStore = useGameStore()
const uiStore = useUiStore()

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
	const skipsToEndGame = MAX_SKIP_PER_PLAYER * gameStore.playerInfos.length
	const skipsRemaining = Math.ceil(
		skipsToEndGame - (gameStore.state.skipCount ?? 0),
	)
	uiStore.confirm = {
		title: `A kör kihagyása`,
		message:
			`Biztos hogy nem teszel semmit?\n\n` +
			(skipsRemaining === 1
				? `Ezzel véget ér a játék.`
				: `Ha a játékosok ezután még ${
						skipsRemaining - 1
				  } alkalommal kihagyják a kört, a játék véget ér.`),
		ok: () => {
			gameStore.skip()
		},
	}
}

const hintsAreOpen = ref(false)

function showHints() {
	if (gameStore.playerInfo.hints > 0) {
		gameStore.playerInfo.hints--
		gameStore.collectTiles()
		gameStore.saveGame()
		hintsAreOpen.value = true
	}
}
</script>

<template>
	<ButtonsComp>
		<button :disabled="okButtonDisabled" @click="gameStore.finishMove">
			<IconComp :icon="okButtonIcon" :color="okButtonIconColor" />{{
				okButtonLabel
			}}<span v-if="gameStore.moveScore > 0" class="score"
				>: {{ gameStore.moveScore }}&nbsp;pont</span
			>
		</button>
		<button @click="gameStore.collectTiles">
			<IconComp :icon="collectIcon" color="#fd0" /> Szedd össze
		</button>
		<button :disabled="!gameStore.canSwap" @click="swapTiles">
			<IconComp :icon="changeIcon" color="#0df" /> Csere
		</button>
		<button @click="skip">
			<IconComp :icon="skipIcon" color="#f78" /> Kihagyom
		</button>
		<button
			v-if="gameStore.hand"
			@click="showHints"
			:disabled="gameStore.playerInfo.hints <= 0"
		>
			<IconComp :icon="hintIcon" color="#f7f" /> Tipp:
			{{ gameStore.playerInfo.hints }}
		</button>
		<button
			v-if="gameStore.tile?.isOwned && gameStore.tile.isJoker"
			@click="$emit('setJokerLetter')"
		>
			<IconComp :icon="pencilSvg" color="#f60" /> Átírom a lapka betűjét
		</button>
		<HintsComp :isOpen="hintsAreOpen" @close="hintsAreOpen = false" />
	</ButtonsComp>
</template>

<style scoped></style>
