import changeIcon from 'bootstrap-icons/icons/arrow-down-up.svg?raw'
import skipIcon from 'bootstrap-icons/icons/arrow-right-square-fill.svg?raw'
import okIcon from 'bootstrap-icons/icons/check-circle-fill.svg?raw'
import collectIcon from 'bootstrap-icons/icons/eject-fill.svg?raw'
import errorIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'
import hintIcon from 'bootstrap-icons/icons/magic.svg?raw'
import pencilSvg from 'bootstrap-icons/icons/pencil-fill.svg?raw'
import stopwatchIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import notOkIcon from 'bootstrap-icons/icons/x-circle-fill.svg?raw'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { Status, useQuery } from '../c-mp/fun/useQuery'
import { mutateState, useState } from '../c-mp/fun/useState'
import { loadWordsValidity } from '../fun/loadWordsValidity'
import { MAX_SKIP_PER_PLAYER } from '../model/MAX_SKIP_PER_PLAYER'
import { Mode } from '../model/Mode'
import { QueryKey } from '../model/QueryKey'
import { gameStore } from '../store/gameStore'
import { uiStore } from '../store/uiStore'
import { ButtonsComp } from './ButtonsComp'
import { HintsComp } from './HintsComp'
import { IconComp } from './IconComp'

export const PlaceTileButtonsComp = defineComponent<{
	onSetJokerLetter: () => void
}>('PlaceTileButtonsComp', (props, $) => {
	const state = useState('state', {
		hintsAreOpen: false,
	})

	const wordsValidity = useQuery('wordsValidity', () => ({
		key: QueryKey.AreWordsValid,
		load: loadWordsValidity,
		params: gameStore.getAllOwnedWordStrings(),
	}))

	const getIsOkButtonDisabled = () => {
		return (
			gameStore.getMoveErrors().length > 0 ||
			wordsValidity.status === Status.Never ||
			wordsValidity.status === Status.Loading ||
			wordsValidity.status === Status.Error ||
			wordsValidity.status === Status.Deleted ||
			(wordsValidity.data?.invalidWords.length ?? 1) > 0
		)
	}
	const getOkButtonLabel = () => {
		if (
			wordsValidity.status === Status.Never ||
			wordsValidity.status === Status.Loading
		)
			return ''
		if (wordsValidity.status === Status.Error) return ' Hiba!'
		if (getIsOkButtonDisabled()) return ' Nem jó!'
		return ' Oké'
	}
	const getOkButtonIcon = () => {
		if (
			wordsValidity.status === Status.Never ||
			wordsValidity.status === Status.Loading
		)
			return stopwatchIcon
		if (wordsValidity.status === Status.Error) return errorIcon
		if (getIsOkButtonDisabled()) return notOkIcon
		return okIcon
	}
	const getOkButtonIconColor = () => {
		if (
			wordsValidity.status === Status.Never ||
			wordsValidity.status === Status.Loading
		)
			return undefined
		if (wordsValidity.status === Status.Error) return '#f78'
		if (getIsOkButtonDisabled()) return undefined
		return 'lightgreen'
	}

	function swapTiles() {
		gameStore.collectTiles()
		gameStore.setMode(Mode.ReplaceTiles)
	}

	function skip() {
		const skipsToEndGame = MAX_SKIP_PER_PLAYER * gameStore.playerInfos.length
		const skipsRemaining = Math.ceil(
			skipsToEndGame - (gameStore.getState().skipCount ?? 0),
		)
		mutateState($.debugName, `set confirm [t6wvz1]`, () => {
			uiStore.confirm = {
				title: `A kör kihagyása`,
				message:
					`Biztos hogy nem teszel semmit?\n\n` +
					(skipsRemaining === 1
						? `Ezzel véget ér a játék.`
						: `Ha a játékosok ezután még ${
								skipsRemaining - 1
						  } alkalommal kihagyják a kört, a játék véget ér.`),
				ok: () => {
					gameStore.skip()
				},
			}
		})
	}

	function showHints() {
		if (gameStore.getPlayerInfo().hints > 0 || gameStore.getState().hintUsed) {
			if (!gameStore.getState().hintUsed) {
				mutateState($.debugName, `use a hint [t6wvz2]`, () => {
					gameStore.getState().hintUsed = true
					gameStore.getPlayerInfo().hints--
				})
				gameStore.saveGame()
			}
			gameStore.collectTiles()
			mutateState($.debugName, `open hints [t68qbb]`, () => {
				state.hintsAreOpen = true
			})
		}
	}

	$.append(
		<>
			<ButtonsComp>
				<button
					disabled={getIsOkButtonDisabled}
					onclick={() => gameStore.finishMove()}
				>
					<IconComp icon={getOkButtonIcon} color={getOkButtonIconColor} />
					{getOkButtonLabel}
					<Show
						when={() => gameStore.getMoveScore() > 0}
						then={() => (
							<span class='score'>
								: {() => gameStore.getMoveScore() + ''}&nbsp;pont
							</span>
						)}
					/>
				</button>
				<button onclick={() => gameStore.collectTiles()}>
					<IconComp icon={collectIcon} color='#fd0' /> Szedd össze
				</button>
				<button
					disabled={() => !gameStore.getCanSwap()}
					onclick={() => swapTiles()}
				>
					<IconComp icon={changeIcon} color='#0df' /> Csere
				</button>
				<button onclick={() => skip()}>
					<IconComp icon={skipIcon} color='#f78' /> Kihagyom
				</button>
				<Show
					when={() => gameStore.getHand}
					then={() => (
						<button
							onclick={() => showHints()}
							disabled={() =>
								gameStore.getPlayerInfo().hints <= 0 &&
								!gameStore.getState().hintUsed
							}
						>
							<IconComp icon={hintIcon} color='#f7f' /> Tipp:{' '}
							{() => gameStore.getPlayerInfo().hints + ''}
						</button>
					)}
				/>
				<Show
					when={() => {
						const tile = gameStore.getTile()
						return tile?.isOwned && tile.isJoker
					}}
					then={() => (
						<button onclick={() => props.onSetJokerLetter()}>
							<IconComp icon={pencilSvg} color='#f60' /> Átírom a lapka betűjét
						</button>
					)}
				/>
			</ButtonsComp>
			<HintsComp
				getIsOpen={() => state.hintsAreOpen}
				onClose={() =>
					mutateState($.debugName, `close hints [t68icz]`, () => {
						state.hintsAreOpen = false
					})
				}
			/>
		</>,
	)

	return $
})
