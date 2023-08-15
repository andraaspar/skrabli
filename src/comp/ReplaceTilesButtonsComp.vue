<script setup lang="ts">
import { Mode } from '@/model/Mode'
import { useGameStore } from '@/store/useGameStore'
import changeIcon from 'bootstrap-icons/icons/arrow-down-up.svg?raw'
import cancelIcon from 'bootstrap-icons/icons/x-circle.svg?raw'
import ButtonsComp from './ButtonsComp.vue'
import IconComp from './IconComp.vue'

const gameStore = useGameStore()

function cancel() {
	gameStore.deselectTilesToReplace()
	gameStore.setMode(Mode.PlaceTile)
}
</script>

<template>
	<ButtonsComp>
		<button @click="gameStore.swap">
			<IconComp :icon="changeIcon" color="#0df" /> Csere
		</button>
		<button @click="cancel">
			<IconComp :icon="cancelIcon" color="#f89" /> Mégse
		</button>
	</ButtonsComp>
</template>

<style scoped></style>
