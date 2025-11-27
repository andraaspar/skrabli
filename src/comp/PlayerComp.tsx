import bagFullIcon from 'bootstrap-icons/icons/bag-fill.svg?raw'
import bagEmptyIcon from 'bootstrap-icons/icons/bag-x.svg?raw'
import playersIcon from 'bootstrap-icons/icons/people.svg?raw'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { mutateState, useState } from '../c-mp/fun/useState'
import { aiLevelToColor } from '../fun/aiLevelToColor'
import { aiLevelToIcon } from '../fun/aiLevelToIcon'
import { gameNameFromPlayerInfos } from '../fun/gameNameFromPlayerInfos'
import { Mode } from '../model/Mode'
import { gameStore } from '../store/gameStore'
import { DialogBodyComp } from './DialogBodyComp'
import { DialogComp } from './DialogComp'
import { DialogHeaderComp } from './DialogHeaderComp'
import { IconComp } from './IconComp'
import css from './PlayerComp.module.css'
import { PlayersComp } from './PlayersComp'

export const PlayerComp = defineComponent<{}>('PlayerComp', (props, $) => {
	const state = useState('state', {
		playersOpen: false,
	})

	function onPlayerClicked() {
		const playerIndex = gameStore.getState().playerIndex!
		const name = prompt(`Mi a neved?`, gameStore.playerInfos[playerIndex]!.name)
		if (name && name.trim()) {
			mutateState($.debugName, `update player name [t6wvy1]`, () => {
				gameStore.playerInfos[playerIndex]!.name = name.trim()
				gameStore.name = gameNameFromPlayerInfos(gameStore.playerInfos)
			})
			gameStore.saveGame()
		}
	}

	$.append(
		<>
			<div class={css.layout}>
				<button
					onclick={() =>
						mutateState($.debugName, `open players list [t68myi]`, () => {
							state.playersOpen = true
						})
					}
				>
					<IconComp icon={playersIcon} color='lch(80 0 0 / .6)' />
				</button>
				<div class={css.player}>
					<button
						class={css['player-name-button']}
						onclick={() => onPlayerClicked()}
					>
						<IconComp
							icon={() => aiLevelToIcon(gameStore.getPlayerInfo().aiLevel)}
							color={() => aiLevelToColor(gameStore.getPlayerInfo().aiLevel)}
						/>{' '}
						{() => gameStore.getPlayerInfo().name}
					</button>
					<div class='score'>{() => gameStore.getPlayerScore() + ''} pont</div>
				</div>
				<Show
					when={() => gameStore.getState().mode !== Mode.Ended}
					then={() => (
						<div class={css.bag} title='Lapkák a zsákban'>
							<IconComp
								icon={() =>
									gameStore.getState().bag.length > 0
										? bagFullIcon
										: bagEmptyIcon
								}
							/>{' '}
							{() => gameStore.getState().bag.length + ''}
						</div>
					)}
				/>
			</div>
			<DialogComp isOpen={() => state.playersOpen}>
				<DialogHeaderComp
					onClose={() =>
						mutateState($.debugName, `close players list [t68n0l]`, () => {
							state.playersOpen = false
						})
					}
				>
					Játékosok
				</DialogHeaderComp>
				<DialogBodyComp>
					<PlayersComp />
				</DialogBodyComp>
			</DialogComp>
		</>,
	)

	return $
})
