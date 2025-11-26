import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { mutateState, useState } from '../c-mp/fun/useState'
import { deleteGameFromDb } from '../fun/deleteGameFromDb'
import { loadContinuableGame } from '../fun/loadContinuableGame'
import { navigate } from '../fun/navigate'
import { BINGO_SCORE } from '../model/Constants'
import { Mode } from '../model/Mode'
import { DEFAULT_GAME_STORE, gameStore } from '../store/gameStore'
import { uiStore } from '../store/uiStore'
import { BoardComp } from './BoardComp'
import { ButtonsComp } from './ButtonsComp'
import { ErrorsComp } from './ErrorsComp'
import css from './GameScreenComp.module.css'
import { HandComp } from './HandComp'
import { HeaderComp } from './HeaderComp'
import { OwnWordInfoComp } from './OwnWordInfoComp'
import { PlaceTileButtonsComp } from './PlaceTileButtonsComp'
import { PlacedWordInfoComp } from './PlacedWordInfoComp'
import { PlayerComp } from './PlayerComp'
import { PlayersComp } from './PlayersComp'
import { ReplaceTilesButtonsComp } from './ReplaceTilesButtonsComp'
import { SetJokerLetterComp } from './SetJokerLetterComp'

export const GameScreenComp = defineComponent<{}>(
	'GameScreenComp',
	(props, $) => {
		const state = useState('state', {
			showSetJokerLetter: false,
		})

		if (!gameStore.getStarted()) {
			uiStore.lockWhile($.debugName, async () => {
				const game = await loadContinuableGame()
				if (game) {
					mutateState(`${$.debugName} load continuable game [t6ww01]`, () => {
						Object.assign(gameStore, game)
					})
				} else {
					navigate('menu')
				}
			})
		}

		async function endGame() {
			await uiStore.lockWhile($.debugName, async () => {
				deleteGameFromDb(gameStore.id)
			})
			mutateState(`${$.debugName} reset game [t6ww02]`, () => {
				Object.assign(gameStore, DEFAULT_GAME_STORE)
			})
			navigate('menu')
		}

		$.append(
			<div class='screen'>
				<HeaderComp>{() => gameStore.name}</HeaderComp>
				<Show
					when={gameStore.getStarted}
					then={() => (
						<>
							<BoardComp
								onSetJokerLetter={() =>
									mutateState(
										`${$.debugName} show joker picker [t68q09]`,
										() => {
											state.showSetJokerLetter = true
										},
									)
								}
							/>
							<div class={css.tools}>
								<Show
									when={() => gameStore.getState().mode === Mode.PlaceTile}
									then={() => (
										<>
											<PlayerComp />
											<HandComp />
											<Show
												when={() => gameStore.getIsBingo()}
												then={() => (
													<div class={css.bingo}>+{BINGO_SCORE + ''} pont!</div>
												)}
											/>
											<OwnWordInfoComp />
											<ErrorsComp />
											<PlaceTileButtonsComp
												onSetJokerLetter={() =>
													mutateState(
														`${$.debugName} show joker picker [t68q0y]`,
														() => {
															state.showSetJokerLetter = true
														},
													)
												}
											/>
											<PlacedWordInfoComp />
										</>
									)}
								/>
								<Show
									when={() => gameStore.getState().mode === Mode.ReplaceTiles}
									then={() => (
										<>
											<PlayerComp />
											<HandComp />
											<ReplaceTilesButtonsComp />
										</>
									)}
								/>
								<Show
									when={() => gameStore.getState().mode === Mode.Ended}
									then={() => (
										<>
											<div class={css.result}>
												<Show
													when={() => gameStore.getIsGameDrawn()}
													then={() => 'Döntetlen!'}
													else={() =>
														`${() => gameStore.getWinnersNames()} győzött!`
													}
												/>
											</div>
											<PlayersComp />
											<ButtonsComp>
												<button onclick={() => endGame()}>Oké</button>
											</ButtonsComp>
										</>
									)}
								/>
							</div>
							<SetJokerLetterComp
								isOpen={() => state.showSetJokerLetter}
								onClose={() =>
									mutateState(
										`${$.debugName} hide joker picker [t68q2l]`,
										() => {
											state.showSetJokerLetter = false
										},
									)
								}
							/>
						</>
					)}
				/>
			</div>,
		)

		return $
	},
)
