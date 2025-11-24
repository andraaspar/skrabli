<script setup lang="ts">
import { computed } from 'vue'
import DialogComp from './DialogComp.vue'
import { LETTERS } from '../model/LETTERS'
import { useGameStore } from '../store/useGameStore'

const props = defineProps<{ isOpen: boolean }>()
const isOpen = computed(() => props.isOpen)

const emit = defineEmits(['close'])

const gameStore = useGameStore()

function onLetterClicked(letterIndex: number) {
	const letter = LETTERS[letterIndex]
	gameStore.setJokerLetter(letter.letter)
	emit('close')
}
</script>

<template>
	<DialogComp :isOpen="isOpen">
		<div class="options">
			<button
				v-for="(letter, letterIndex) of LETTERS"
				:key="letterIndex"
				@click="onLetterClicked(letterIndex)"
				class="option"
			>
				{{ letter.letter }}
			</button>
		</div>
	</DialogComp>
</template>

<style scoped>
.options {
	display: grid;
	grid-template-columns: repeat(5, 12vmin);
	grid-gap: var(--gap);
}
.option {
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-family: serif;
	font-style: italic;
	font-size: 6vmin;
}
</style>
