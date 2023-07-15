<script setup lang="ts">
import type { ITile } from '@/model/ITile'
import { Mode } from '@/model/Mode'
import { useStore } from '@/store/useStore'
import ButtonsComp from './ButtonsComp.vue'
import IconComp from './IconComp.vue'
import changeIcon from 'bootstrap-icons/icons/arrow-down-up.svg?raw'
import cancelIcon from 'bootstrap-icons/icons/x-circle.svg?raw'

const store = useStore()

function replaceTiles() {
	const hand = store.hands[store.playerIndex!]
	const tilesToReplace = hand.filter(
		(tile, aHandIndex) => store.handIndicesToReplace[aHandIndex],
	) as ITile[]
	store.removeTilesToReplaceFromHand()
	store.deselectTilesToReplace()
	store.fillHand()
	store.addTilesToBag(tilesToReplace)
	store.resetSkipCount()
	store.setMode(Mode.PlaceTile)
	store.nextPlayer()
	store.saveGame()
}

function cancel() {
	store.deselectTilesToReplace()
	store.setMode(Mode.PlaceTile)
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
