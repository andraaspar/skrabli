import refreshIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?raw'
import updateIcon from 'bootstrap-icons/icons/arrow-up-square-fill.svg?raw'
import playIcon from 'bootstrap-icons/icons/play-circle-fill.svg?raw'
import starIcon from 'bootstrap-icons/icons/star-fill.svg?raw'
import deleteIcon from 'bootstrap-icons/icons/x-circle.svg?raw'
import logoSvg from '../asset/logo.svg?raw'
import { For } from '../c-mp/comp/For'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { mutateState, useState } from '../c-mp/fun/useState'
import { continueableGameExists } from '../fun/continueableGameExists'
import { deleteGameFromDb } from '../fun/deleteGameFromDb'
import { getNoError } from '../fun/getNoError'
import { loadContinuableGame } from '../fun/loadContinuableGame'
import { loadGame } from '../fun/loadGame'
import { loadGameInfos } from '../fun/loadGameInfos'
import { navigate } from '../fun/navigate'
import { useLoadAllWordsValidity } from '../fun/useLoadAllWordsValidity'
import { LocalStorageKey } from '../model/LocalStorageKey'
import { TGameInfo } from '../model/TGameInfo'
import { DEFAULT_GAME_STORE, gameStore } from '../store/gameStore'
import { uiStore } from '../store/uiStore'
import { IconComp } from './IconComp'
import css from './MenuScreenComp.module.css'

export const MenuScreenComp = defineComponent<{}>(
	'MenuScreenComp',
	(props, $) => {
		const state = useState('state', {
			gameInfos: undefined as TGameInfo[] | undefined,
			allWordsValidityUpdated: getNoError(Infinity, () =>
				parseInt(
					localStorage[LocalStorageKey.AllWordsValidityUpdated] ?? '0',
					10,
				),
			),
		})

		$.append(
			<>
				<div class='screen'>
					<Show
						when={() => state.gameInfos != null}
						then={() => (
							<>
								<div class={css.menu}>
									<div innerHTML={logoSvg} class={css.logo} />
									<Show
										when={() => !!uiStore.updateServiceWorker}
										then={() => (
											<div class='buttons'>
												<button class={css.green} onclick={update}>
													<IconComp icon={updateIcon} /> Frissítsd az
													alkalmazást
												</button>
											</div>
										)}
									/>
									<Show
										when={() =>
											gameStore.getStarted() || continueableGameExists()
										}
										then={() => (
											<div class='buttons'>
												<button onclick={continueGame}>
													<IconComp icon={playIcon} color='lch(80 100 260)' />{' '}
													Folytatás
												</button>
											</div>
										)}
									/>
									<Show
										when={() => (state.gameInfos?.length ?? 0) > 0}
										then={() => (
											<div class={css['menu-buttons']}>
												<For
													each={() => state.gameInfos}
													render={(gameInfo) => (
														<div class={css['button-row']}>
															<button
																class={css.flex}
																onclick={() => loadGameById(gameInfo.item.id)}
															>
																{() => gameInfo.item.name}
															</button>
															<button
																onclick={() => deleteGameById(gameInfo.item.id)}
															>
																<IconComp
																	icon={deleteIcon}
																	color='lch(80 100 30)'
																/>
															</button>
														</div>
													)}
												/>
											</div>
										)}
									/>
									<div class='buttons'>
										<button onclick={startNewGame}>
											<IconComp icon={starIcon} color='lch(80 100 70)' /> Új
											játék
										</button>
									</div>
									<div class='buttons'>
										<button
											onclick={() => loadAllWordsValidity()}
											disabled={() => !wordsValidityExpired()}
										>
											<IconComp icon={refreshIcon} color='#5f3' />
											Frissítsd a szavakat
										</button>
									</div>
								</div>
								<div class={css.version}>Verzió: {BUILD_TIMESTAMP}</div>
							</>
						)}
					/>
				</div>
			</>,
		)

		async function continueGame() {
			if (!gameStore.getStarted()) {
				await uiStore.lockWhile(async () => {
					const game = await loadContinuableGame()
					if (game) {
						mutateState('continueGame set game [t62op2]', () => {
							console.log(`[t68jnk] gameStore:`, gameStore, `game:`, game)
							Object.assign(gameStore, game)
						})
					}
				})
			}
			if (gameStore.getStarted()) {
				navigate('game')
			}
		}

		function startNewGame() {
			navigate('new')
		}

		function onSuccess() {
			mutateState('update allWordsValidityUpdated [t62ni1]', () => {
				state.allWordsValidityUpdated = Date.now()
			})
		}
		const { loadAllWordsValidity } = useLoadAllWordsValidity(onSuccess)

		uiStore.lockWhile(async () => {
			const gameInfos = await loadGameInfos()
			mutateState('set gameInfos [t62nft]', () => {
				state.gameInfos = gameInfos
			})
		})

		async function loadGameById(id: string) {
			await uiStore.lockWhile(async () => {
				const game = await loadGame(id)
				if (!game) throw new Error(`[ryb06t] Game not found!`)
				mutateState('set loaded game [t62nj8]', () => {
					Object.assign(gameStore, game)
				})
			})
			navigate('game')
		}

		function getGameTitleById(id: string): string {
			if (!state.gameInfos) return ''
			const gameInfo = state.gameInfos.find((it) => it.id === id)
			return gameInfo?.name ?? ''
		}

		async function deleteGameById(id: string) {
			mutateState('set confirm [t62nas]', () => {
				uiStore.confirm = {
					title: `Törlés`,
					message: `Biztosan töröljem a játékot?\n${getGameTitleById(id)}`,
					ok: async () => {
						await uiStore.lockWhile(async () => {
							await deleteGameFromDb(id)
							const gameInfos = await loadGameInfos()
							mutateState('set gameInfos [t62nft]', () => {
								state.gameInfos = gameInfos
							})
						})
						if (gameStore.id === id) {
							Object.assign(gameStore, DEFAULT_GAME_STORE)
						}
					},
				}
			})
		}

		async function update() {
			if (uiStore.updateServiceWorker) {
				await uiStore.lockWhile(uiStore.updateServiceWorker)
			}
		}

		function wordsValidityExpired() {
			return state.allWordsValidityUpdated < Date.now() - 1000 * 60 * 5 // 5 minutes
		}

		return $
	},
)
