import warningIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { IconComp } from './IconComp'
import css from './WarningComp.module.css'

export const WarningComp = defineComponent<{
	warning: () => string | undefined
}>('WarningComp', (props, $) => {
	$.append(
		<Show
			when={props.warning}
			then={() => (
				<div class={css.warning}>
					<div class={css.content}>
						<IconComp icon={warningIcon} color='#f70' />
						<div class={css.message}>{props.warning}</div>
					</div>
				</div>
			)}
		/>,
	)

	return $
})
