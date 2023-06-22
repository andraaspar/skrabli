import { useEffect } from 'react'
import { connect } from 'react-redux'
import { setWordsValidity } from '../action/actions'
import { getWordString } from '../fun/getWordString'
import { loadWordsValidity } from '../fun/loadWordsValidity'
import { IAppState } from '../model/AppState'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectAllOwnedWords } from '../select/selectAllOwnedWords'
import { selectOwnValidAndInvalidWords } from '../select/selectOwnValidAndInvalidWords'
import { DispatchProp } from './DispatchProp'
import './OwnWordInfoComp.css'
import { WordListComp } from './WordListComp'

export interface OwnWordInfoCompPropsFromStore {
	words: IField[][]
	wordsValidAndInvalid: IValidAndInvalidWords | null
}
export interface OwnWordInfoCompProps
	extends OwnWordInfoCompPropsFromStore,
		DispatchProp {}

export const OwnWordInfoComp = connect(
	(state: IAppState): OwnWordInfoCompPropsFromStore => ({
		words: selectAllOwnedWords(state),
		wordsValidAndInvalid: selectOwnValidAndInvalidWords(state),
	}),
)(({ words, wordsValidAndInvalid, dispatch }: OwnWordInfoCompProps) => {
	useEffect(() => {
		let aborted = false
		;(async () => {
			dispatch(setWordsValidity(Date.now()))
			try {
				const wordsValidity = await loadWordsValidity(
					words.map((word) => getWordString(word)),
				)
				if (!aborted) {
					dispatch(setWordsValidity({ loaded: wordsValidity }))
				}
			} catch (e) {
				console.error(e)
				if (!aborted) {
					dispatch(setWordsValidity(e + ''))
				}
			}
		})()

		return () => {
			aborted = true
		}
	}, [words, dispatch])
	return (
		<>
			{wordsValidAndInvalid && (
				<div className='own-word-info'>
					<WordListComp
						words={wordsValidAndInvalid.valid}
						label={`Érvényes szavak`}
						showScore
						wordClassName='valid-word'
						scoreClassName='word-score'
					/>
					<WordListComp
						words={wordsValidAndInvalid.invalid}
						label={`Érvényetelen szavak`}
						wordClassName='invalid-word'
					/>
				</div>
			)}
		</>
	)
})
