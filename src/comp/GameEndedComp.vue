<script setup lang="ts">
import { useStore } from '@/store/useStore'
import PlayersComp from './PlayersComp.vue'
import ButtonsComp from './ButtonsComp.vue'

const store = useStore()
</script>

<template>
	<div class="result">
		<template v-if="store.isGameDrawn">Döntetlen!</template>
		<template v-else>{{ store.winnersNames }} győzött!</template>
	</div>
	<PlayersComp />
	<ButtonsComp>
		<button @click="store.newGame">⭐ Új játék</button>
	</ButtonsComp>
</template>

<style scoped>
.result {
	padding: 6vmin 2vmin;
	text-align: center;
	font-size: 6vmin;
}
</style>
