import changeIcon from 'bootstrap-icons/icons/arrow-down-up.svg?raw'
import cancelIcon from 'bootstrap-icons/icons/x-circle.svg?raw'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { Mode } from '../model/Mode'
import { gameStore } from '../store/gameStore'
import { ButtonsComp } from './ButtonsComp'
import { IconComp } from './IconComp'

export const ReplaceTilesButtonsComp = defineComponent<{}>(
	'ReplaceTilesButtonsComp',
	(props, $) => {
		function cancel() {
			gameStore.deselectTilesToReplace()
			gameStore.setMode(Mode.PlaceTile)
		}

		$.append(
			<ButtonsComp>
				<button onclick={() => gameStore.swap()}>
					<IconComp icon={changeIcon} color='#0df' /> Csere
				</button>
				<button onclick={() => cancel()}>
					<IconComp icon={cancelIcon} color='#f89' /> Mégse
				</button>
			</ButtonsComp>,
		)

		return $
	},
)
