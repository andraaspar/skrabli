import xSvg from 'bootstrap-icons/icons/x-lg.svg?raw'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { TChildrenIn } from '../c-mp/model/TChildren'
import { IconComp } from './IconComp'

export const DialogHeaderComp = defineComponent<{
	children?: TChildrenIn
	onClose: () => void
}>('DialogHeaderComp', (props, $) => {
	$.append(
		<div class='dialog-header'>
			<div class='dialog-header-title'>{props.children}</div>
			<button
				class='dialog-header-close'
				title='Zárd be'
				onclick={props.onClose}
			>
				<IconComp icon={xSvg} />
			</button>
		</div>,
	)

	return $
})
