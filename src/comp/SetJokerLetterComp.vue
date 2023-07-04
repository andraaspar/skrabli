<script setup lang="ts">
import { computed } from 'vue'
import DialogComp from './DialogComp.vue'
import { LETTERS } from '@/model/LETTERS'
import { useStore } from '@/store/useStore'

const props = defineProps<{ isOpen: boolean }>()
const isOpen = computed(() => props.isOpen)

const emit = defineEmits(['close'])

const store = useStore()

function onLetterClicked(letterIndex: number) {
	const letter = LETTERS[letterIndex]
	store.setJokerLetter(letter.letter)
	emit('close')
}
</script>

<template>
	<DialogComp :isOpen="isOpen">
		<div class="options">
			<button
				v-for="(letter, letterIndex) of LETTERS"
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
	grid-template-columns: repeat(5, 10vmin);
	grid-gap: 2vmin;
}
.option {
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 4vmin;
}
</style>
