import okIcon from 'bootstrap-icons/icons/check-circle-fill.svg?raw'
import loadingSvg from 'bootstrap-icons/icons/stopwatch.svg?raw'
import cancelIcon from 'bootstrap-icons/icons/x-circle.svg?raw'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { mutateState } from '../c-mp/fun/useState'
import { onHashChange } from '../fun/onHashChange'
import { Screen, uiStore } from '../store/uiStore'
import css from './AppComp.module.css'
import { ButtonsComp } from './ButtonsComp'
import { DialogBodyComp } from './DialogBodyComp'
import { DialogComp } from './DialogComp'
import { DialogHeaderComp } from './DialogHeaderComp'
import { ErrorComp } from './ErrorComp'
import { GameScreenComp } from './GameScreenComp'
import { IconComp } from './IconComp'
import { MenuScreenComp } from './MenuScreenComp'
import { NewGameScreenComp } from './NewGameScreenComp'

export const AppComp = defineComponent<{}>('AppComp', (props, $) => {
	window.addEventListener('hashchange', onHashChange)
	onHashChange()

	function acceptConfirm() {
		try {
			uiStore.confirm?.ok()
		} catch (e) {
			console.error(e)
		}
		mutateState(`${$.debugName} clear confirm [t68hvx]`, () => {
			uiStore.confirm = undefined
		})
	}

	function cancelConfirm() {
		mutateState(`${$.debugName} cancel confirm [t68hvy]`, () => {
			uiStore.confirm = undefined
		})
	}

	$.append(
		<>
			<Show
				when={() => uiStore.screen === Screen.Menu}
				then={() => <MenuScreenComp />}
			/>
			<Show
				when={() => uiStore.screen === Screen.New}
				then={() => <NewGameScreenComp />}
			/>
			<Show
				when={() => uiStore.screen === Screen.Game}
				then={() => <GameScreenComp />}
			/>
			<DialogComp isOpen={() => !!uiStore.error}>
				<DialogHeaderComp
					onClose={() =>
						mutateState(`${$.debugName} clear error [t68hvz]`, () => {
							uiStore.error = ''
						})
					}
				>
					Hiba!
				</DialogHeaderComp>
				<DialogBodyComp>
					<ErrorComp error={uiStore.error} />
				</DialogBodyComp>
			</DialogComp>
			<DialogComp isOpen={() => uiStore.isLocked()} openDelay={1}>
				<IconComp icon={loadingSvg} />
			</DialogComp>
			<DialogComp isOpen={() => !!uiStore.confirm}>
				<DialogHeaderComp onClose={cancelConfirm}>
					{() => uiStore.confirm?.title}
				</DialogHeaderComp>
				<DialogBodyComp>
					<div class={css.message}>{() => uiStore.confirm?.message}</div>
					<ButtonsComp>
						<button onclick={acceptConfirm} class='green'>
							<IconComp icon={okIcon} /> Rendben
						</button>
						<button onclick={cancelConfirm} class='red'>
							<IconComp icon={cancelIcon} /> Mégse
						</button>
					</ButtonsComp>
				</DialogBodyComp>
			</DialogComp>
		</>,
	)

	return $
})
