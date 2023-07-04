<script setup lang="ts">
import { useStore } from '@/store/useStore'
import WordListComp from './WordListComp.vue'
import { QueryKey } from '@/model/QueryKey'
import { toRaw } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { loadWordsValidity } from '@/fun/loadWordsValidity'
import { computed } from 'vue'
import type { IField } from '@/model/IField'
import { getWordString } from '@/fun/getWordString'
import type { IValidAndInvalidWords } from '@/model/IValidAndInvalidWords'

const store = useStore()

const queryKey = computed(() => [
	QueryKey.AreWordsValid,
	store.allOwnedWordStrings,
])
function queryFn() {
	return loadWordsValidity(store.allOwnedWordStrings)
}
const { data: response } = useQuery({
	queryKey: queryKey,
	queryFn: queryFn,
})

const validity = computed((): IValidAndInvalidWords | null => {
	if (!response.value) return null
	const valid: IField[][] = []
	const invalid: IField[][] = []
	for (let word of store.allOwnedWords) {
		if (response.value.validWords.includes(getWordString(word))) {
			valid.push(word)
		} else {
			invalid.push(word)
		}
	}
	if (valid.length > 0 || invalid.length > 0) {
		return {
			valid,
			invalid,
		}
	} else {
		return null
	}
})
</script>

<template>
	<div v-if="validity" class="own-word-info">
		<WordListComp :words="validity.valid" :validity="true" :showScore="true">
			<template v-slot:label>Érvényes szavak</template>
		</WordListComp>
		<WordListComp :words="validity.invalid" :validity="false"
			><template v-slot:label>Érvényetelen szavak</template></WordListComp
		>
	</div>
</template>

<style scoped>
.own-word-info {
	padding: 1vmin;
}
</style>
