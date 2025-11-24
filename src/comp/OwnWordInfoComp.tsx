import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { useQuery } from '../c-mp/fun/useQuery'
import { getWordString } from '../fun/getWordString'
import { loadWordsValidity } from '../fun/loadWordsValidity'
import { IField } from '../model/IField'
import { QueryKey } from '../model/QueryKey'
import { gameStore } from '../store/gameStore'
import css from './OwnWordInfoComp.module.css'
import { WordListComp } from './WordListComp'

export const OwnWordInfoComp = defineComponent<{}>(
	'OwnWordInfoComp',
	(props, $) => {
		const wordsValidity = useQuery('', () => ({
			key: QueryKey.AreWordsValid,
			load: async () => {
				const response = await loadWordsValidity(
					gameStore.getAllOwnedWordStrings(),
				)
				const valid: IField[][] = []
				const invalid: IField[][] = []
				for (let word of gameStore.getAllOwnedWords()) {
					if (response.validWords.includes(getWordString(word))) {
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
			},
			params: {},
		}))

		$.append(
			<Show
				when={() => wordsValidity.data != null}
				then={() => (
					<div class={css['own-word-info']}>
						<WordListComp
							getWords={() => wordsValidity.data!.valid}
							getValidity={() => true}
							getShowScore={() => true}
							getLabel={() => 'Szabályos szavak'}
						/>
						<WordListComp
							getWords={() => wordsValidity.data!.invalid}
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
