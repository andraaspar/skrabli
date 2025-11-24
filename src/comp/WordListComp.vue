<script setup lang="ts">
import { getWordScore } from '../fun/getWordScore'
import { getWordString } from '../fun/getWordString'
import type { IField } from '../model/IField'
import { computed, ref } from 'vue'
import WordInfoComp from './WordInfoComp.vue'
import ButtonsComp from './ButtonsComp.vue'

const props = withDefaults(
	defineProps<{
		words: IField[][]
		showScore?: boolean
		validity?: boolean
	}>(),
	{
		validity: undefined,
	},
)

const wordStrings = computed(() =>
	props.words.map((word) => getWordString(word)),
)

const openWordIndex = ref(-1)
</script>

<template>
	<div v-if="props.words.length > 0" class="word-list">
		<div v-if="$slots.label" class="label">
			<slot name="label"></slot>
		</div>
		<ButtonsComp>
			<button
				v-for="(word, index) of words"
				:key="index"
				@click="openWordIndex = index"
			>
				<span
					:class="{
						'valid-word': props.validity,
						'invalid-word': props.validity === false,
					}"
					>{{ wordStrings[index].replace(' ', '\u00a0') }}</span
				><template v-if="props.showScore">
					{{ ' '
					}}<span class="score"
						>{{ getWordScore(word) }}&nbsp;pont</span
					></template
				>
			</button>
		</ButtonsComp>
		<WordInfoComp
			:word="wordStrings[openWordIndex]"
			:isValid="props.validity"
			@close="openWordIndex = -1"
		/>
	</div>
</template>

<style scoped>
.word-list {
	display: flex;
	flex-flow: column;
	gap: var(--gap);
	text-align: center;
}
.words {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	gap: 1px;
}
.label {
	font-weight: bold;
	opacity: 0.8;
	text-transform: uppercase;
	font-size: 0.6em;
	padding-top: 1vmin;
}

.invalid-word {
	font-style: italic;
	color: lightpink;
}

.valid-word {
	font-weight: bold;
	color: lightgreen;
}
</style>
