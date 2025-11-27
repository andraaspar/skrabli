import { defineComponent } from '../c-mp/fun/defineComponent'
import { TChildrenIn } from '../c-mp/model/TChildren'
import css from './ButtonsComp.module.css'

export const ButtonsComp = defineComponent<{ children?: TChildrenIn }>(
	'ButtonsComp',
	(props, $) => {
		$.append(<div class={css.buttons}>{props.children}</div>)

		return $
	},
)
