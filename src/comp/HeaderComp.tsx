import listSvg from 'bootstrap-icons/icons/list.svg?raw'
import logoSvg from '../asset/logo.svg?raw'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { TChildrenIn } from '../c-mp/model/TChildrenIn'
import { navigate } from '../fun/navigate'
import css from './HeaderComp.module.css'
import { IconComp } from './IconComp'

export const HeaderComp = defineComponent<{ children?: TChildrenIn }>(
	'HeaderComp',
	(props, $) => {
		$.append(
			<div class={css['header-row']}>
				<IconComp icon={logoSvg} class={css.logo} />
				<div class={css.title}>{props.children}</div>
				<button class='button' onclick={() => navigate('menu')}>
					<IconComp icon={listSvg} />
				</button>
			</div>,
		)

		return $
	},
)
