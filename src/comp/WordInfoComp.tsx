import signalIcon from 'bootstrap-icons/icons/hand-index-fill.svg?raw'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { url } from '../c-mp/fun/url'
import { useEffect } from '../c-mp/fun/useEffect'
import { mutateState, useState } from '../c-mp/fun/useState'
import { getKnownWords } from '../fun/getKnownWords'
import { uiStore } from '../store/uiStore'
import { ButtonsComp } from './ButtonsComp'
import { DialogBodyComp } from './DialogBodyComp'
import { DialogComp } from './DialogComp'
import { DialogHeaderComp } from './DialogHeaderComp'
import { IconComp } from './IconComp'
import css from './WordInfoComp.module.css'

export const WordInfoComp = defineComponent<{
	getWord: () => string | undefined
	getIsValid: (() => boolean) | undefined
	onClose: () => void
}>('WordInfoComp', (props, $) => {
	const state = useState('state', {
		isWordValid: undefined as boolean | undefined,
	})

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

	async function suggestWord() {
		const word = props.getWord()
		const isValid = state.isWordValid
		if (!word) throw new Error(`[rxwcdk] No word!`)
		mutateState($.debugName, `set confirm [t6wvt2]`, () => {
			uiStore.confirm = {
				title:
					'„' +
					word +
					'" ' +
					(isValid ? `legyen szabálytalan` : `legyen szabályos`),
				message: `Itt jelezheted nekem, hogy a kiválasztott „${word}" ${
					isValid ? `szó legyen szabálytalan.` : `szó legyen szabályos.`
				}

FONTOS:
1. Ha ige, csak az egyes szám harmadik személyű alakja (pl. eszik, megy, tesz) szabályos.
2. Ha főnév, csak ragozatlan alakban (pl. asztal, szék, zimankó) szabályos.
3. Ha melléknév, akkor csak az alapesetű alakban (pl. egész, kerek, szép) szabályos.
4. Nemzetiségek és rasszok jelzői (pl. magyar, rác, sváb) nem szabályosak.
5. Ritka szavakat csak akkor fogadok el, ha van szócikkük a Wikiszótárban vagy a Wikipédián.
6. Trágárságot nem fogadok el.
7. Időbe telik – napok, hetek, hónapok, ki tudja? Légy türelmes!
8. Az én döntésem, hogy mit fogadok el. Légy megértő!`,
				ok: async () => {
					if (isValid) {
						window.open(
							url`https://github.com/andraaspar/skrabli/issues/new?template=${'érvénytelen-szó'}.md&title=${word}`,
							'_blank',
						)
					} else {
						window.open(
							url`https://github.com/andraaspar/skrabli/issues/new?template=${'új-szó'}.md&title=${word}`,
							'_blank',
						)
					}
				},
			}
		})
	}

	let lastWord: string | undefined = undefined
	let lastIsValid: boolean | undefined = undefined
	useEffect(`update word is valid [t68rno]`, () => {
		const word = props.getWord()
		const isValid = props.getIsValid?.()
		if (word === lastWord && isValid === lastIsValid) return
		lastWord = word
		lastIsValid = isValid

		if (word == null) {
			mutateState($.debugName, `update isWordValid [t6wvt5]`, () => {
				state.isWordValid = isValid
			})
		} else if (isValid != null) {
			mutateState($.debugName, `update isWordValid [t6wvt6]`, () => {
				state.isWordValid = isValid
			})
		} else {
			mutateState($.debugName, `update isWordValid [t6wvt7]`, () => {
				state.isWordValid = undefined
			})
			;(async () => {
				const knownWords = await getKnownWords()
				if (props.getWord() === word) {
					mutateState($.debugName, `update isWordValid [t6wvt8]`, () => {
						state.isWordValid = knownWords.includes(word)
					})
				}
			})()
		}
	})

	$.append(
		<DialogComp isOpen={() => !!props.getWord()}>
			<DialogHeaderComp onClose={() => props.onClose()}>
				{() =>
					state.isWordValid === true
						? 'Szabályos szó:'
						: state.isWordValid === false
						? 'Szabálytalan szó:'
						: 'Szó:'
				}{' '}
				<span
					class={() => [
						state.isWordValid && css['valid-word'],
						state.isWordValid === false && css['invalid-word'],
					]}
				>
					{props.getWord}
				</span>
			</DialogHeaderComp>
			<DialogBodyComp>
				<Show
					when={() => props.getWord()}
					then={() => {
						const word = props.getWord()
						if (!word) return ''
						return (
							<ButtonsComp>
								<a
									class='button'
									href={() => makeMekLink(word)}
									target='_blank'
									rel='noopener noreferrer'
								>
									MÉK
								</a>
								<a
									class='button'
									href={() => makeWiktionaryLink(word)}
									target='_blank'
									rel='noopener noreferrer'
								>
									Wikiszótár
								</a>
								<a
									class='button'
									href={() => makeWikipediaLink(word)}
									target='_blank'
									rel='noopener noreferrer'
								>
									Wikipédia
								</a>
								<a
									class='button'
									href={() => makeGoogleLink(word)}
									target='_blank'
									rel='noopener noreferrer'
								>
									Google
								</a>
								<a
									class='button'
									href={() => makeMtaLink(word)}
									target='_blank'
									rel='noopener noreferrer'
								>
									MTA
								</a>
							</ButtonsComp>
						)
					}}
				/>
				<Show
					when={() => state.isWordValid != null}
					then={() => (
						<ButtonsComp>
							<button onclick={() => suggestWord()}>
								<IconComp icon={signalIcon} color='#f89' />{' '}
								{() =>
									state.isWordValid
										? 'Jelzem ezt a szót, legyen szabálytalan!'
										: 'Kérem ezt a szót, legyen szabályos!'
								}
							</button>
						</ButtonsComp>
					)}
				/>
			</DialogBodyComp>
		</DialogComp>,
	)

	return $
})
