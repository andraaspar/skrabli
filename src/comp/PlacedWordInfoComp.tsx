import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { gameStore } from '../store/gameStore'
import css from './PlacedWordInfoComp.module.css'
import { WordListComp } from './WordListComp'

export const PlacedWordInfoComp = defineComponent<{}>(
	'PlacedWordInfoComp',
	(props, $) => {
		$.append(
			<Show
				when={() => !!gameStore.getPlacedValidAndInvalidWords()}
				then={() => (
					<div class={css['placed-word-info']}>
						<WordListComp
							getWords={() => gameStore.getPlacedValidAndInvalidWords()!.valid}
							getLabel={() => 'Szavak a választott mezőn'}
						/>
					</div>
				)}
			/>,
		)

		return $
	},
)
