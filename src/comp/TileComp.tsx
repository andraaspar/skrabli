import { defineComponent } from '../c-mp/fun/defineComponent'
import { ITile } from '../model/ITile'
import css from './TileComp.module.css'

export const TileComp = defineComponent<{
	getTile: () => ITile
	getNeverOwned?: () => boolean
}>('TileComp', (props, $) => {
	$.append(
		<div
			class={() => {
				const tile = props.getTile()
				return [
					css.tile,
					!props.getNeverOwned?.() && tile.isOwned && css['is-owned'],
					tile.isJoker && css['is-joker'],
					tile.isLast && css['is-last'],
				]
			}}
		>
			<div class={css['tile-letter']}>{() => props.getTile().letter}</div>
			<div class={css['tile-score']}>{() => props.getTile().score + ''}</div>
		</div>,
	)

	return $
})
