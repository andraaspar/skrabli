<script setup lang="ts">
import { useStore } from '@/store/useStore'
import WordListComp from './WordListComp.vue'

const store = useStore()
</script>

<template>
	<div v-if="!!store.placedValidAndInvalidWords" className="placed-word-info">
		<WordListComp :words="store.placedValidAndInvalidWords.valid"
			><template v-slot:label>Szavak a választott mezőn</template></WordListComp
		>
	</div>
</template>

<style scoped>
.placed-word-info {
	padding: 1vmin;
}
</style>
