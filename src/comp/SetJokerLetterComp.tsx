import { For } from '../c-mp/comp/For'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { LETTERS } from '../model/LETTERS'
import { gameStore } from '../store/gameStore'
import { DialogComp } from './DialogComp'
import css from './SetJokerLetterComp.module.css'

export const SetJokerLetterComp = defineComponent<{
	isOpen: () => boolean
	onClose: () => void
}>('SetJokerLetterComp', (props, $) => {
	function onLetterClicked(letterIndex: number) {
		const letter = LETTERS[letterIndex]!
		gameStore.setJokerLetter(letter.letter)
		props.onClose()
	}

	$.append(
		<DialogComp isOpen={props.isOpen}>
			<div class={css.options}>
				<For
					debugName='joker letter buttons [t6c1jv]'
					each={() => LETTERS}
					render={(letter) => (
						<button
							onclick={() => onLetterClicked(letter.index)}
							class={css.option}
						>
							{() => letter.item.letter}
						</button>
					)}
				/>
			</div>
		</DialogComp>,
	)

	return $
})
