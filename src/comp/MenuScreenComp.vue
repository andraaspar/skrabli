<script setup lang="ts">
import { savedGameExists } from '@/fun/savedGameExists'
import { Mode } from '@/model/Mode'
import { useStore } from '@/store/useStore'
import { useRouter } from 'vue-router'
import IconComp from './IconComp.vue'
import playIcon from 'bootstrap-icons/icons/play-circle-fill.svg?raw'
import starIcon from 'bootstrap-icons/icons/star-fill.svg?raw'

const store = useStore()
const router = useRouter()

function continueGame() {
	if (store.mode === Mode.NotStarted) {
		store.loadGame()
	}
	goToGameScreen()
}

function startNewGame() {
	store.newGame()
	goToGameScreen()
}

function goToGameScreen() {
	router.push({ name: 'game' })
}
</script>

<template>
	<div class="menu">
		<button
			v-if="store.mode !== Mode.NotStarted || savedGameExists()"
			@click="continueGame"
		>
			<IconComp :icon="playIcon" color="#0bd" /> Folytatás
		</button>
		<button @click="startNewGame">
			<IconComp :icon="starIcon" color="#fc0" /> Új játék
		</button>
	</div>
</template>

<style scoped>
.menu {
	display: flex;
	flex-flow: column;
	padding: var(--gap);
	gap: var(--gap);
	margin: auto;
}
</style>
