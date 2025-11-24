import { For } from '../c-mp/comp/For'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { gameStore } from '../store/gameStore'
import css from './HandComp.module.css'
import { TileComp } from './TileComp'

export const HandComp = defineComponent<{}>('HandComp', (props, $) => {
	$.append(
		<Show
			when={() => gameStore.getState().playerIndex != null}
			then={() => (
				<div class={css.hand}>
					<For
						each={() =>
							gameStore.getState().hands[gameStore.getState().playerIndex!]
						}
						render={(tile) => (
							<div
								class={() => [
									css['hand-slot'],
									tile.index === gameStore.getState().handIndex &&
										css['is-selected'],
									gameStore.getState().handIndicesToReplace[tile.index] &&
										css['is-to-be-replaced'],
								]}
								onclick={() => gameStore.selectHand(tile.index)}
							>
								<Show
									when={() => tile.item}
									then={() => (
										<TileComp
											getTile={() => tile.item!}
											getNeverOwned={() => true}
										/>
									)}
								/>
							</div>
						)}
					/>
				</div>
			)}
		/>,
	)

	return $
})
