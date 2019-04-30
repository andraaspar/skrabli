import * as React from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../model/AppState'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectOwnValidAndInvalidWords } from '../select/selectOwnValidAndInvalidWords'
import { DispatchProp } from './DispatchProp'
import './OwnWordInfoComp.css'
import { WordListComp } from './WordListComp'

export interface OwnWordInfoCompPropsFromStore {
	words: IValidAndInvalidWords | null
}
export interface OwnWordInfoCompProps
	extends OwnWordInfoCompPropsFromStore,
		DispatchProp {}

export const OwnWordInfoComp = connect(
	(state: IAppState): OwnWordInfoCompPropsFromStore => ({
		words: selectOwnValidAndInvalidWords(state),
	}),
)(({ words, dispatch }: OwnWordInfoCompProps) => {
	return (
		<>
			{words && (
				<div className='own-word-info'>
					<WordListComp
						words={words.valid}
						label={`Érvényes szavak`}
						showScore
						wordClassName='valid-word'
						scoreClassName='word-score'
					/>
					<WordListComp
						words={words.invalid}
						label={`Érvényetelen szavak`}
						wordClassName='invalid-word'
					/>
				</div>
			)}
		</>
	)
})
