import { defineComponent } from '../c-mp/fun/defineComponent'
import { TChildrenIn } from '../c-mp/model/TChildren'
import css from './DialogBodyComp.module.css'

export const DialogBodyComp = defineComponent<{ children?: TChildrenIn }>(
	'DialogBodyComp',
	(props, $) => {
		$.append(<div class={css['dialog-body']}>{props.children}</div>)

		return $
	},
)
