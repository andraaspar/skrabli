<script setup lang="ts">
import type { ITile } from '@/model/ITile'
import { Mode } from '@/model/Mode'
import { useGameStore } from '@/store/useGameStore'
import ButtonsComp from './ButtonsComp.vue'
import IconComp from './IconComp.vue'
import changeIcon from 'bootstrap-icons/icons/arrow-down-up.svg?raw'
import cancelIcon from 'bootstrap-icons/icons/x-circle.svg?raw'

const gameStore = useGameStore()

function replaceTiles() {
	const hand = gameStore.state.hands[gameStore.state.playerIndex!]
	const tilesToReplace = hand.filter(
		(tile, aHandIndex) => gameStore.state.handIndicesToReplace[aHandIndex],
	) as ITile[]
	gameStore.removeTilesToReplaceFromHand()
	gameStore.deselectTilesToReplace()
	gameStore.fillHand()
	gameStore.addTilesToBag(tilesToReplace)
	gameStore.resetSkipCount()
	gameStore.setMode(Mode.PlaceTile)
	gameStore.nextPlayer()
	gameStore.setUndoPoint()
	gameStore.saveGame()
}

function cancel() {
	gameStore.deselectTilesToReplace()
	gameStore.setMode(Mode.PlaceTile)
}
</script>

<template>
	<ButtonsComp>
		<button @click="replaceTiles">
			<IconComp :icon="changeIcon" color="#0df" /> Csere
		</button>
		<button @click="cancel">
			<IconComp :icon="cancelIcon" color="#f89" /> Mégse
		</button>
	</ButtonsComp>
</template>

<style scoped></style>
