import { For } from '../c-mp/comp/For'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { mutateState, useState } from '../c-mp/fun/useState'
import { TSlotGetter } from '../c-mp/model/TChildren'
import { getWordScore } from '../fun/getWordScore'
import { getWordString } from '../fun/getWordString'
import { IField } from '../model/IField'
import { ButtonsComp } from './ButtonsComp'
import { WordInfoComp } from './WordInfoComp'
import css from './WordListComp.module.css'

export const WordListComp = defineComponent<{
	getWords: () => IField[][]
	getShowScore?: () => boolean
	getValidity?: () => boolean
	getLabel?: TSlotGetter
}>('WordListComp', (props, $) => {
	const state = useState('state', {
		openWordIndex: -1,
	})

	$.append(
		<Show
			debugName='WordListComp.words'
			when={() => props.getWords().length > 0}
			then={() => {
				const words = props.getWords()
				const wordStrings = words.map((word) => getWordString(word))

				return (
					<div class={css['word-list']}>
						<Show
							when={() => props.getLabel?.()}
							then={() => <div class={css.label}>{props.getLabel}</div>}
						/>
						<ButtonsComp>
							<For
								debugName='words [t6c1ka]'
								each={() => words}
								render={(word) => (
									<button
										onclick={() =>
											mutateState(
												$.debugName,
												`set open word index [t68q97]`,
												() => {
													state.openWordIndex = word.index
												},
											)
										}
									>
										<span
											class={() => [
												props.getValidity?.() && css['valid-word'],
												props.getValidity?.() === false && css['invalid-word'],
											]}
										>
											{() => wordStrings[word.index]!.replace(' ', '\u00a0')}
										</span>
										<Show
											when={props.getShowScore}
											then={() => (
												<>
													{' '}
													<span class='score'>
														{() => getWordScore(word.item) + ''}
														&nbsp;pont
													</span>
												</>
											)}
										/>
									</button>
								)}
							/>
						</ButtonsComp>
						<WordInfoComp
							getWord={() => wordStrings[state.openWordIndex]!}
							getIsValid={props.getValidity}
							onClose={() =>
								mutateState(
									$.debugName,
									`unset open word index [t68qa6]`,
									() => {
										state.openWordIndex = -1
									},
								)
							}
						/>
					</div>
				)
			}}
		/>,
	)

	return $
})
