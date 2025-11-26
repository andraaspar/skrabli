import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { useEffect } from '../c-mp/fun/useEffect'
import { useQuery } from '../c-mp/fun/useQuery'
import { mutateState, useState } from '../c-mp/fun/useState'
import { getWordString } from '../fun/getWordString'
import { loadWordsValidity } from '../fun/loadWordsValidity'
import { IField } from '../model/IField'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { QueryKey } from '../model/QueryKey'
import { gameStore } from '../store/gameStore'
import css from './OwnWordInfoComp.module.css'
import { WordListComp } from './WordListComp'

export const OwnWordInfoComp = defineComponent<{}>(
	'OwnWordInfoComp',
	(props, $) => {
		const wordsValidity = useQuery('wordsValidity', () => ({
			key: QueryKey.AreWordsValid,
			load: loadWordsValidity,
			params: gameStore.getAllOwnedWordStrings(),
		}))

		const validAndInvalidWords = useState('validAndInvalidWords', {
			value: undefined as IValidAndInvalidWords | undefined,
		})

		useEffect('update wordsValidity [t6cbzm]', () => {
			if (!wordsValidity.data) {
				mutateState(`${$.debugName} no words validity [t6cbty]`, () => {
					validAndInvalidWords.value = undefined
				})
				return
			}
			const valid: IField[][] = []
			const invalid: IField[][] = []
			for (let word of gameStore.getAllOwnedWords()) {
				if (wordsValidity.data.validWords.includes(getWordString(word))) {
					valid.push(word)
				} else {
					invalid.push(word)
				}
			}
			if (valid.length > 0 || invalid.length > 0) {
				mutateState(`${$.debugName} set words validity [t6cbus]`, () => {
					validAndInvalidWords.value = {
						valid,
						invalid,
					}
				})
			} else {
				mutateState(`${$.debugName} no words validity [t6cbv3]`, () => {
					validAndInvalidWords.value = undefined
				})
			}
		})

		$.append(
			<Show
				debugName='validAndInvalidWords'
				when={() => validAndInvalidWords.value != null}
				then={() => (
					<div class={css['own-word-info']}>
						<WordListComp
							getWords={() => validAndInvalidWords.value?.valid ?? []}
							getValidity={() => true}
							getShowScore={() => true}
							getLabel={() => 'Szabályos szavak'}
						/>
						<WordListComp
							getWords={() => validAndInvalidWords.value?.invalid ?? []}
							getValidity={() => false}
							getLabel={() => 'Szabálytalan szavak'}
						/>
					</div>
				)}
			/>,
		)

		return $
	},
)
