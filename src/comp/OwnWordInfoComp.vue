<script setup lang="ts">
import { getWordString } from '@/fun/getWordString'
import { loadWordsValidity } from '@/fun/loadWordsValidity'
import type { IField } from '@/model/IField'
import type { IValidAndInvalidWords } from '@/model/IValidAndInvalidWords'
import { QueryKey } from '@/model/QueryKey'
import { useStore } from '@/store/useStore'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import WordListComp from './WordListComp.vue'

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
			<template v-slot:label>Szabályos szavak</template>
		</WordListComp>
		<WordListComp :words="validity.invalid" :validity="false"
			><template v-slot:label>Szabálytalan szavak</template></WordListComp
		>
	</div>
</template>

<style scoped>
.own-word-info {
	padding: 1vmin;
}
</style>
