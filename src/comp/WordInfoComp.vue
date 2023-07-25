<script setup lang="ts">
import { suggestWordToServer } from '@/fun/suggestWordToServer'
import { useLoadAllWordsValidity } from '@/fun/useLoadAllWordsValidity'
import type { TSuggestResponse } from '@/model/TSuggestResponse'
import successIcon from 'bootstrap-icons/icons/check-circle-fill.svg?raw'
import errorIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'
import signalIcon from 'bootstrap-icons/icons/hand-index-fill.svg?raw'
import slowIcon from 'bootstrap-icons/icons/hourglass-split.svg?raw'
import { computed, ref, watch } from 'vue'
import ButtonsComp from './ButtonsComp.vue'
import DialogBodyComp from './DialogBodyComp.vue'
import DialogComp from './DialogComp.vue'
import DialogHeaderComp from './DialogHeaderComp.vue'
import IconComp from './IconComp.vue'
import refreshIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?raw'
import { useUiStore } from '@/store/useUiStore'
import { getKnownWords } from '@/fun/getKnownWords'

const props = withDefaults(
	defineProps<{ word: string | undefined; isValid: boolean | undefined }>(),
	{
		isValid: undefined,
	},
)
const emit = defineEmits(['close'])

const uiStore = useUiStore()

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

function makeMtaLink(wordString: string) {
	return `https://helyesiras.mta.hu/helyesiras/default/suggest?q=${encodeURIComponent(
		wordString,
	)}`
}

const suggestWordData = ref<TSuggestResponse | undefined>()
async function suggestWord() {
	const word = props.word
	const isValid = isWordValid.value
	try {
		suggestWordData.value = undefined
		if (!word) throw new Error(`[rxwcdk] No word!`)
		if (
			window.confirm(`Itt jelezheted nekem, hogy a kiválasztott „${word}” ${
				isValid
					? `szó nem szabályos.`
					: `szót szeretnéd szabályossá tenni a játékban.`
			}

FONTOS:
1. Ha ige, csak az egyes szám harmadik személyű alakja (pl. eszik, megy, tesz) szabályos.
2. Ha főnév, csak ragozatlan alakban (pl. asztal, szék, zimankó) szabályos.
3. Ha melléknév, akkor csak az alapesetű alakban (pl. egész, kerek, szép) szabályos.
4. Nemzetiségek és rasszok jelzői (pl. magyar, rác, sváb) nem szabályosak.
5. Ritka szavakat csak akkor fogadok el, ha van szócikkük a Wikiszótárban vagy a Wikipédián.
6. Trágárságot nem fogadok el.
7. Időbe telik – napok, hetek, hónapok, ki tudja? Légy türelmes!
8. Az én döntésem, hogy mit fogadok el. Légy megértő!`)
		) {
			await uiStore.lockWhile(async () => {
				suggestWordData.value = await suggestWordToServer(word, !isValid)
			})
		}
	} catch (e) {
		console.error(`[rxwchg]`, e)
		uiStore.error = e + ''
	}
}

function onSuccess() {
	emit('close')
}
const { loadAllWordsValidity } = useLoadAllWordsValidity(onSuccess)

const suggestWordLabel = computed(() => {
	if (suggestWordData.value) {
		const res = suggestWordData.value
		if ('valid' in res) {
			const extra = res.valid === isWordValid.value ? 'Már elbíráltam: ' : ''
			if (res.valid) {
				return extra + 'A szó szabályos!'
			} else {
				return extra + 'A szó szabálytalan!'
			}
		} else if ('alreadySuggested' in res) {
			return 'Már kérték, rajta vagyok!'
		} else if ('alreadyRejected' in res) {
			return 'Már kérték, de sajnos nem szabályos!'
		}
		return 'Sikerült! Egy következő játékban ismét megpróbálhatod.'
	}
	return isWordValid.value
		? 'Jelzem ezt a szót, mert szabálytalan!'
		: 'Kérem ezt a szót, mert szabályos!'
})

const suggestWordIcon = computed(() => {
	if (suggestWordData.value) {
		const res = suggestWordData.value
		if ('valid' in res) {
			return errorIcon
		} else if ('alreadySuggested' in res) {
			return slowIcon
		} else if ('alreadyRejected' in res) {
			return errorIcon
		}
		return successIcon
	}
	return signalIcon
})

const label = computed(() => {
	if (isWordValid.value === true) {
		return 'Szabályos szó:'
	} else if (isWordValid.value === false) {
		return 'Szabálytalan szó:'
	} else {
		return 'Szó:'
	}
})

const isWordValid = ref<boolean | undefined>()
watch([() => props.word, () => props.isValid], async () => {
	const word = props.word
	const isValid = props.isValid
	if (word == null) {
		isWordValid.value = isValid
	} else if (isValid != null) {
		isWordValid.value = isValid
	} else {
		isWordValid.value = undefined
		const knownWords = await getKnownWords()
		if (props.word === word) {
			isWordValid.value = knownWords.includes(word)
		}
	}
})
</script>

<template>
	<DialogComp :isOpen="!!props.word">
		<DialogHeaderComp @close="$emit('close')">
			{{ label }}
			<span
				:class="{
					'valid-word': isWordValid,
					'invalid-word': isWordValid === false,
				}"
			>
				{{ props.word }}
			</span>
		</DialogHeaderComp>
		<DialogBodyComp>
			<ButtonsComp v-if="props.word">
				<a
					class="button"
					:href="makeMekLink(props.word)"
					target="_blank"
					rel="noopener noreferrer"
					>MÉK</a
				>
				<a
					class="button"
					:href="makeWiktionaryLink(props.word)"
					target="_blank"
					rel="noopener noreferrer"
					>Wikiszótár</a
				>
				<a
					class="button"
					:href="makeWikipediaLink(props.word)"
					target="_blank"
					rel="noopener noreferrer"
					>Wikipédia</a
				>
				<a
					class="button"
					:href="makeGoogleLink(props.word)"
					target="_blank"
					rel="noopener noreferrer"
					>Google</a
				>
				<a
					class="button"
					:href="makeMtaLink(props.word)"
					target="_blank"
					rel="noopener noreferrer"
					>MTA</a
				>
			</ButtonsComp>
			<ButtonsComp v-if="isWordValid != null">
				<button @click="suggestWord" :disabled="!!suggestWordData">
					<IconComp :icon="suggestWordIcon" color="#f89" />
					{{ suggestWordLabel }}
				</button>
				<button
					v-if="
						suggestWordData &&
						'valid' in suggestWordData &&
						suggestWordData.valid !== isWordValid
					"
					@click="loadAllWordsValidity"
				>
					<IconComp :icon="refreshIcon" />
					Frissítsd a szavakat
				</button>
			</ButtonsComp>
		</DialogBodyComp>
	</DialogComp>
</template>

<style scoped>
.invalid-word {
	font-style: italic;
	color: lightpink;
}

.valid-word {
	font-weight: bold;
	color: lightgreen;
}
</style>
