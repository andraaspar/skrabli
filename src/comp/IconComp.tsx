import { defineComponent } from '../c-mp/fun/defineComponent'
import css from './IconComp.module.css'

export const IconComp = defineComponent<{
	icon: string | (() => string)
	class?: string | (() => string | undefined)
	color?: string | (() => string | undefined)
	rotate90AndFlip?: boolean
}>('IconComp', (props, $) => {
	let elem: HTMLSpanElement

	$.append(
		<span
			ref={(it) => (elem = it)}
			class={() => [
				css.icon,
				props.rotate90AndFlip && css['rotate-90-and-flip'],
				typeof props.class === 'function' ? props.class() : props.class,
			]}
			style={() => ({
				color: typeof props.color === 'function' ? props.color() : props.color,
			})}
			innerHTML={() =>
				(typeof props.icon === 'function' ? props.icon() : props.icon)
					.replace(` width="16"`, '')
					.replace(` height="16"`, '')
			}
		/>,
	)

	return $
})
