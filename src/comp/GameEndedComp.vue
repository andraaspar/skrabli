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
	<div class="buttons">
		<RouterLink class="button" :to="{ name: 'menu' }">Oké</RouterLink>
	</div>
</template>

<style scoped>
.result {
	padding: 6vmin var(--gap);
	text-align: center;
	font-size: 6vmin;
}
.buttons {
	display: flex;
	align-content: center;
	padding: var(--gap);
}
</style>
