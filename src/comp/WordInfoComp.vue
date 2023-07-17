<script setup lang="ts">
import { suggestWordToServer } from '@/fun/suggestWordToServer'
import { useLoadAllWordsValidity } from '@/fun/useLoadAllWordsValidity'
import type { TSuggestResponse } from '@/model/TSuggestResponse'
import successIcon from 'bootstrap-icons/icons/check-circle-fill.svg?raw'
import errorIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'
import signalIcon from 'bootstrap-icons/icons/hand-index-fill.svg?raw'
import slowIcon from 'bootstrap-icons/icons/hourglass-split.svg?raw'
import loadingIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import closeIcon from 'bootstrap-icons/icons/x-lg.svg?raw'
import { computed, ref } from 'vue'
import ButtonsComp from './ButtonsComp.vue'
import DialogComp from './DialogComp.vue'
import IconComp from './IconComp.vue'
import ErrorComp from './ErrorComp.vue'

const props = withDefaults(
	defineProps<{ word: string | undefined; isValid: boolean | undefined }>(),
	{
		isValid: undefined,
	},
)
const emit = defineEmits(['close'])

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

const suggestWordError = ref<unknown>()
const suggestWordIsLoading = ref<boolean>(false)
const suggestWordData = ref<TSuggestResponse | undefined>()
async function suggestWord() {
	try {
		suggestWordData.value = undefined
		suggestWordError.value = undefined
		suggestWordIsLoading.value = true
		if (!props.word) throw new Error(`[rxwcdk] No word!`)
		if (
			window.confirm(`Itt jelezheted nekem, hogy a kiválasztott „${
				props.word
			}” ${
				props.isValid
					? `szó nem szabályos.`
					: `szót szeretnéd érvényessé tenni a játékban.`
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
			suggestWordData.value = await suggestWordToServer(
				props.word,
				!props.isValid,
			)
		}
	} catch (e) {
		console.error(`[rxwchg]`, e)
		suggestWordError.value = e
	} finally {
		suggestWordIsLoading.value = false
	}
}

function onSuccess() {
	emit('close')
}
const {
	loadAllWordsValidity,
	loadAllWordsValidityError,
	loadAllWordsValidityIsLoading,
	loadAllWordsValidityIcon,
	loadAllWordsValidityLabel,
} = useLoadAllWordsValidity(onSuccess)

const suggestWordLabel = computed(() => {
	if (suggestWordIsLoading.value) {
		return ''
	} else if (suggestWordError.value) {
		return 'Hiba!'
	} else if (suggestWordData.value) {
		const res = suggestWordData.value
		if ('valid' in res) {
			const extra =
				res.valid === props.isValid ? ' Fellebezésnek helye nincs.' : ''
			if (res.valid) {
				return 'A szó érvényes!' + extra
			} else {
				return 'A szó érvénytelen!' + extra
			}
		} else if ('alreadySuggested' in res) {
			return 'Már kérték, rajta vagyok!'
		} else if ('alreadyRejected' in res) {
			return 'Már kérték, de sajnos nem érvényes!'
		}
		return 'Sikerült! Egy következő játékban ismét megpróbálhatod.'
	}
	return props.isValid
		? 'Jelzem ezt a szót, mert érvénytelen!'
		: 'Kérem ezt a szót, mert érvényes!'
})

const suggestWordIcon = computed(() => {
	if (suggestWordIsLoading.value) {
		return loadingIcon
	} else if (suggestWordError.value) {
		return errorIcon
	} else if (suggestWordData.value) {
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
	if (props.isValid === true) {
		return 'Érvényes szó:'
	} else if (props.isValid === false) {
		return 'Érvénytelen szó:'
	} else {
		return 'Szó:'
	}
})
</script>

<template>
	<DialogComp :isOpen="!!props.word">
		<div>
			{{ label }}
			<span
				:class="{
					'valid-word': props.isValid,
					'invalid-word': props.isValid === false,
				}"
			>
				{{ props.word }}
			</span>
		</div>
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
		<ErrorComp :error="suggestWordError" />
		<ErrorComp :error="loadAllWordsValidityError" />
		<ButtonsComp v-if="props.isValid != null">
			<button
				@click="suggestWord"
				:disabled="!!suggestWordData || suggestWordIsLoading"
			>
				<IconComp :icon="suggestWordIcon" /> {{ suggestWordLabel }}
			</button>
			<button
				v-if="
					suggestWordData &&
					'valid' in suggestWordData &&
					suggestWordData.valid !== props.isValid
				"
				:disabled="loadAllWordsValidityIsLoading"
				@click="loadAllWordsValidity"
			>
				<IconComp :icon="loadAllWordsValidityIcon" />
				{{ loadAllWordsValidityLabel }}
			</button>
		</ButtonsComp>
		<ButtonsComp>
			<button @click="$emit('close')">
				<IconComp :icon="closeIcon" /> Zárd be
			</button>
		</ButtonsComp>
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
