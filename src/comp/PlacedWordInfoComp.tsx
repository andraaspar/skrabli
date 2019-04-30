import * as React from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../model/AppState'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectPlacedValidAndInvalidWords } from '../select/selectPlacedValidAndInvalidWords'
import { DispatchProp } from './DispatchProp'
import './PlacedWordInfoComp.css'
import { WordListComp } from './WordListComp'

export interface PlacedWordInfoCompPropsFromStore {
	words: IValidAndInvalidWords | null
}
export interface PlacedWordInfoCompProps
	extends PlacedWordInfoCompPropsFromStore,
		DispatchProp {}

export const PlacedWordInfoComp = connect(
	(state: IAppState): PlacedWordInfoCompPropsFromStore => ({
		words: selectPlacedValidAndInvalidWords(state),
	}),
)(({ words, dispatch }: PlacedWordInfoCompProps) => {
	return (
		<>
			{words && (
				<div className='placed-word-info'>
					<WordListComp
						words={words.valid}
						label={`Szavak a választott mezőn`}
					/>
				</div>
			)}
		</>
	)
})
