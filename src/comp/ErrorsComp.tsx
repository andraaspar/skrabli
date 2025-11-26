import { For } from '../c-mp/comp/For'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { MoveError } from '../model/MoveError'
import { gameStore } from '../store/gameStore'
import css from './ErrorsComp.module.css'
import { WarningComp } from './WarningComp'

export const ErrorsComp = defineComponent<{}>('ErrorsComp', (props, $) => {
	function errorToString(error: MoveError) {
		switch (error) {
			case MoveError.NoConnection:
				return `Kapcsolódnod kell a meglévő lapkákhoz!`
			case MoveError.NoDirection:
				return `Egy vonalba tedd a lapkáid, hézag nélkül!`
			case MoveError.NoStart:
				return `Érintened kell a Start mezőt!`
			case MoveError.NoTile:
				return `Tégy le egy lapkát!`
			case MoveError.OneTile:
				return `Egy szabályos szóhoz legalább két lapka kell!`
			default:
				return `[ppy6tx]: ${error}`
		}
	}

	$.append(
		<Show
			when={() => gameStore.getMoveErrors().length > 0}
			then={() => (
				<div class={css.errors}>
					<For
						debugName='move errors [t6c1ge]'
						each={() => gameStore.getMoveErrors()}
						render={(error) => (
							<WarningComp warning={() => errorToString(error.item)} />
						)}
					/>
				</div>
			)}
		/>,
	)

	return $
})
