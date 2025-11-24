<script setup lang="ts">
import { useGameStore } from '../store/useGameStore'
import WordListComp from './WordListComp.vue'

const gameStore = useGameStore()
</script>

<template>
	<div
		v-if="!!gameStore.placedValidAndInvalidWords"
		className="placed-word-info"
	>
		<WordListComp :words="gameStore.placedValidAndInvalidWords.valid"
			><template v-slot:label>Szavak a választott mezőn</template></WordListComp
		>
	</div>
</template>

<style scoped>
.placed-word-info {
	padding: 1vmin;
}
</style>
