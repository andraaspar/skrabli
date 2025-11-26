import { For } from '../c-mp/comp/For'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { aiLevelToColor } from '../fun/aiLevelToColor'
import { aiLevelToIcon } from '../fun/aiLevelToIcon'
import { numberToSignedString } from '../fun/numberToSignedString'
import { Mode } from '../model/Mode'
import { gameStore } from '../store/gameStore'
import { IconComp } from './IconComp'
import css from './PlayersComp.module.css'

export const PlayersComp = defineComponent<{}>('PlayersComp', (props, $) => {
	$.append(
		<div class={css.players}>
			<For
				debugName='players [t6c1kw]'
				each={() => gameStore.playerInfos}
				render={(playerInfo) => (
					<>
						<div>
							<IconComp
								icon={() => aiLevelToIcon(playerInfo.item.aiLevel)}
								color={() => aiLevelToColor(playerInfo.item.aiLevel)}
							/>{' '}
							{() => playerInfo.item.name}
						</div>
						<div class='score'>
							{() =>
								gameStore.getState().playerScores.at(playerInfo.index) + ''
							}{' '}
							pont
							<Show
								when={() => gameStore.getState().mode === Mode.Ended}
								then={() => (
									<div class={css['player-bonus']}>
										{() =>
											numberToSignedString(
												gameStore.getPlayerBonuses()[playerInfo.index]!,
											)
										}{' '}
										pont
									</div>
								)}
							/>
						</div>
						<div class={css.tiles}>
							{() =>
								gameStore.getState().hands.at(playerInfo.index)?.filter(Boolean)
									.length + ''
							}{' '}
							lapka
						</div>
					</>
				)}
			/>
		</div>,
	)

	return $
})
