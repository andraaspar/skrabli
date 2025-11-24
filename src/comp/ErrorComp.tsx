import errorIcon from 'bootstrap-icons/icons/exclamation-octagon-fill.svg?raw'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { IconComp } from './IconComp'
import css from './ErrorComp.module.css'

export const ErrorComp = defineComponent<{ error: unknown }>(
	'ErrorComp',
	(props, $) => {
		$.append(
			<Show
				when={() => props.error}
				then={() => (
					<div class={css.error}>
						<div class={css.content}>
							<IconComp icon={errorIcon} color='#f03' />
							<div class={css.message}>
								Hiba történt!
								<div class={css.detail}>{() => props.error + ''}</div>
							</div>
						</div>
					</div>
				)}
			/>,
		)

		return $
	},
)
