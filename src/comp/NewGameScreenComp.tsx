import arrowLeftIcon from 'bootstrap-icons/icons/arrow-left.svg?raw'
import arrowRightIcon from 'bootstrap-icons/icons/arrow-right.svg?raw'
import addPlayerIcon from 'bootstrap-icons/icons/person-add.svg?raw'
import playIcon from 'bootstrap-icons/icons/play-circle-fill.svg?raw'
import trashIcon from 'bootstrap-icons/icons/trash3-fill.svg?raw'
import { For } from '../c-mp/comp/For'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { mutateState, useState } from '../c-mp/fun/useState'
import { aiLevelToColor } from '../fun/aiLevelToColor'
import { aiLevelToIcon } from '../fun/aiLevelToIcon'
import { aiLevelToString } from '../fun/aiLevelToString'
import { jsonClone } from '../fun/jsonClone'
import { range } from '../fun/range'
import { replaceLocation } from '../fun/replaceLocation'
import { withInterface } from '../fun/withInterface'
import { AiLevel } from '../model/AiLevel'
import { BOARDS } from '../model/BOARDS'
import { HAND_SIZE } from '../model/Constants'
import { INewPlayer } from '../model/INewPlayer'
import { ITile } from '../model/ITile'
import { LETTERS } from '../model/LETTERS'
import { Mode } from '../model/Mode'
import { DEFAULT_GAME_STORE, gameStore } from '../store/gameStore'
import { BoardComp } from './BoardComp'
import { ButtonsComp } from './ButtonsComp'
import { DialogBodyComp } from './DialogBodyComp'
import { DialogComp } from './DialogComp'
import { DialogHeaderComp } from './DialogHeaderComp'
import { HeaderComp } from './HeaderComp'
import { IconComp } from './IconComp'
import css from './NewGameScreenComp.module.css'
import { WarningComp } from './WarningComp'

const LEVELS = [
	AiLevel.Human,
	AiLevel.Easy,
	AiLevel.Medium,
	AiLevel.Hard,
	AiLevel.VeryHard,
	AiLevel.Ultimate,
]

export const NewGameScreenComp = defineComponent<{}>(
	'NewGameScreenComp',
	(props, $) => {
		const state = useState('state', {
			newGame: {
				players: [
					{
						name: '1. játékos',
						level: AiLevel.Human,
					},
					{
						name: `2. ${aiLevelToString(AiLevel.Easy)}`,
						level: AiLevel.Easy,
					},
				] as INewPlayer[],
				hintsCount: 3,
				boardIndex: 0,
			},
			changeLevelIndex: undefined as number | undefined,
		})

		const changeLevelName = () => {
			if (state.changeLevelIndex == null) return ''
			return state.newGame.players.at(state.changeLevelIndex)?.name ?? ''
		}

		const warning = () => {
			const players = state.newGame.players
			if (players.length < 2) {
				return `Legalább két játékos kell!`
			}
			if (!players.find((player) => player.level === AiLevel.Human)) {
				return `Legalább egy emberi játékosnak kell lennie!`
			}
			return undefined
		}

		function nextBoard(offset: number) {
			mutateState(`${$.debugName} nextBoard [t6wx01]`, () => {
				state.newGame.boardIndex += offset
				if (state.newGame.boardIndex < 0)
					state.newGame.boardIndex = BOARDS.length - 1
				if (state.newGame.boardIndex >= BOARDS.length)
					state.newGame.boardIndex = 0
			})
		}

		function addPlayer() {
			mutateState(`${$.debugName} addPlayer [t6wx02]`, () => {
				state.newGame.players.push({
					name: `${state.newGame.players.length + 1}. játékos`,
					level: AiLevel.Human,
				})
			})
		}

		function removePlayer(index: number) {
			mutateState(`${$.debugName} removePlayer [t6wx03]`, () => {
				state.newGame.players.splice(index, 1)
			})
		}

		function changeLevel(index: number) {
			mutateState(`${$.debugName} changeLevel [t6wx04]`, () => {
				state.changeLevelIndex = index
			})
		}

		function selectLevel(aiLevel: AiLevel) {
			mutateState(`${$.debugName} selectLevel [t6wx05]`, () => {
				const player = state.newGame.players.at(state.changeLevelIndex!)
				if (player) {
					if (player.level !== aiLevel) {
						player.level = aiLevel
						player.name = `${state.changeLevelIndex! + 1}. ${aiLevelToString(
							aiLevel,
						)}`
					}
					closeChangeLevel()
				}
			})
		}

		function closeChangeLevel() {
			mutateState(`${$.debugName} closeChangeLevel [t6wx06]`, () => {
				state.changeLevelIndex = undefined
			})
		}

		function onInputHintsCount(e: Event) {
			const value = (e.currentTarget as HTMLInputElement).value.trim()
			if (value) {
				const num = parseInt(value, 10)
				if (!isNaN(num) && isFinite(num)) {
					mutateState(`${$.debugName} onInputHintsCount [t6wx07]`, () => {
						state.newGame.hintsCount = Math.max(0, Math.min(999, num))
					})
				}
			}
		}

		function onInputHintsBlur(e: Event) {
			;(e.currentTarget as HTMLInputElement).value =
				state.newGame.hintsCount + ''
		}

		function start() {
			const board = jsonClone(BOARDS[state.newGame.boardIndex]!.board)
			const boardSize = jsonClone(BOARDS[state.newGame.boardIndex]!.boardSize)
			mutateState(`${$.debugName} start game [t6wx08]`, () => {
				Object.assign(gameStore, DEFAULT_GAME_STORE)
				gameStore.playerInfos = state.newGame.players.map((player) => ({
					name: player.name,
					aiLevel: player.level,
					hints: state.newGame.hintsCount,
				}))
				gameStore.states = [
					{
						mode: Mode.PlaceTile,
						playerScores: state.newGame.players.map(() => 0),
						hands: state.newGame.players.map(() =>
							range(HAND_SIZE).map(() => null),
						),
						playerIndex: null,
						fieldIndex: null,
						handIndex: null,
						startingHandCount: null,
						skipCount: null,
						hintUsed: false,
						handIndicesToReplace: range(HAND_SIZE).map(() => false),
						board,
						boardSize,
						bag: LETTERS.flatMap(({ count, letter, score }) =>
							range(count).map(() =>
								withInterface<ITile>({
									letter,
									score,
									isOwned: null,
									isJoker: letter === ' ' || null,
									isLast: null,
								}),
							),
						),
					},
				]
			})
			gameStore.startGame()
			replaceLocation('game')
		}

		$.append(
			<div class='screen'>
				<HeaderComp>Új játék</HeaderComp>
				<div class={css['board-and-buttons']}>
					<BoardComp
						isSmaller={true}
						getBoardInfo={() => BOARDS[state.newGame.boardIndex]!}
						onSetJokerLetter={() => {}}
					/>
					<ButtonsComp>
						<button onclick={() => nextBoard(-1)}>
							<IconComp icon={arrowLeftIcon} /> Előző tábla
						</button>
						<button onclick={() => nextBoard(1)}>
							Következő tábla <IconComp icon={arrowRightIcon} />
						</button>
					</ButtonsComp>
				</div>
				<div class={css.form}>
					<div class={css['form-control']}>
						<div class={css['form-label']}>Játékosok</div>
						<div class={css.players}>
							<For
								debugName='players [t6c1j8]'
								each={() => state.newGame.players}
								render={(newPlayer) => (
									<>
										<input
											value={() => newPlayer.item.name}
											oninput={(e) => {
												mutateState(
													`${$.debugName} update player name [t6wx09]`,
													() => {
														newPlayer.item.name = (
															e.currentTarget as HTMLInputElement
														).value
													},
												)
											}}
											size={12}
											disabled={() => newPlayer.item.level !== AiLevel.Human}
										/>
										<button onclick={() => changeLevel(newPlayer.index)}>
											<IconComp
												icon={() => aiLevelToIcon(newPlayer.item.level)}
												color={() => aiLevelToColor(newPlayer.item.level)}
											/>{' '}
											{() => aiLevelToString(newPlayer.item.level)}
										</button>
										<button onclick={() => removePlayer(newPlayer.index)}>
											<IconComp icon={trashIcon} color='lch(80 100 30)' />
										</button>
									</>
								)}
							/>
						</div>
						<Show
							when={() => state.newGame.players.length === 0}
							then={() => <div class={css.none}>Nincsenek játékosok!</div>}
						/>
						<ButtonsComp>
							<button onclick={addPlayer}>
								<IconComp icon={addPlayerIcon} color='lch(80 100 180)' /> Új
								játékos
							</button>
						</ButtonsComp>
					</div>
					<div class={css['form-control']}>
						<label class={css['form-label']} for='hints-count'>
							Tippek
						</label>
						<div class={css['form-control-centered']}>
							<input
								id='hints-count'
								value={() => state.newGame.hintsCount + ''}
								oninput={(e) => onInputHintsCount(e)}
								onblur={(e) => onInputHintsBlur(e)}
								size={1}
							/>
						</div>
					</div>
					<WarningComp warning={warning} />
					<ButtonsComp>
						<button onclick={() => start()} disabled={() => !!warning()}>
							<IconComp icon={playIcon} color='lch(80 100 260)' /> Start!
						</button>
					</ButtonsComp>
				</div>
				<DialogComp isOpen={() => state.changeLevelIndex != null}>
					<DialogHeaderComp onClose={() => closeChangeLevel()}>
						{changeLevelName}
					</DialogHeaderComp>
					<DialogBodyComp>
						<div class={css['form-buttons']}>
							<For
								debugName='AI level buttons [t6c1io]'
								each={() => LEVELS}
								render={(aiLevel) => (
									<button onclick={() => selectLevel(aiLevel.item)}>
										<IconComp
											icon={() => aiLevelToIcon(aiLevel.item)}
											color={() => aiLevelToColor(aiLevel.item)}
										/>
										{() => aiLevelToString(aiLevel.item)}
									</button>
								)}
							/>
						</div>
					</DialogBodyComp>
				</DialogComp>
			</div>,
		)

		return $
	},
)
