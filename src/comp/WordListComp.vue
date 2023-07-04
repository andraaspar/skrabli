<script setup lang="ts">
import { getWordScore } from '@/fun/getWordScore'
import { getWordString } from '@/fun/getWordString'
import type { IField } from '@/model/IField'
import { computed, ref } from 'vue'
import DialogComp from './DialogComp.vue'

const props = defineProps<{
	words: IField[][]
	showScore?: boolean
	validity?: boolean
}>()

const wordStrings = computed(() =>
	props.words.map((word) => getWordString(word)),
)

function makeMekLink(wordString: string) {
	return `http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
		`"${wordString}"`,
	)}`
}

function makeWiktionaryLink(wordString: string) {
	return `https://hu.wiktionary.org/w/index.php?search=${encodeURIComponent(
		wordString,
	)}`
}

function makeWikipediaLink(wordString: string) {
	return `https://hu.wikipedia.org/w/index.php?search=${encodeURIComponent(
		wordString,
	)}`
}

function makeGoogleLink(wordString: string) {
	return `https://www.google.hu/search?q=${encodeURIComponent(
		`"${wordString}"`,
	)}`
}

const openWordIndex = ref(-1)
</script>

<template>
	<div v-if="props.words.length > 0" class="word-list">
		<div v-if="$slots.label" class="label">
			<slot name="label"></slot>
		</div>
		<div class="words">
			<button v-for="(word, index) of words" @click="openWordIndex = index">
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
		</div>
		<DialogComp :isOpen="openWordIndex >= 0">
			<div
				:class="{
					'valid-word': props.validity,
					'invalid-word': props.validity === false,
				}"
			>
				{{ wordStrings[openWordIndex] }}
			</div>
			<div>
				<a
					:href="makeMekLink(wordStrings[openWordIndex])"
					target="_blank"
					rel="noopener noreferrer"
					>MÉK</a
				>
				<a
					:href="makeWiktionaryLink(wordStrings[openWordIndex])"
					target="_blank"
					rel="noopener noreferrer"
					>Wiktionary</a
				>
				<a
					:href="makeWikipediaLink(wordStrings[openWordIndex])"
					target="_blank"
					rel="noopener noreferrer"
					>Wikipedia</a
				>
				<a
					:href="makeGoogleLink(wordStrings[openWordIndex])"
					target="_blank"
					rel="noopener noreferrer"
					>Google</a
				>
			</div>
			<div>
				<button @click="openWordIndex = -1">Zárd be</button>
			</div>
		</DialogComp>
	</div>
</template>

<style scoped>
.word-list {
	display: flex;
	flex-flow: column;
	gap: 2vmin;
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
