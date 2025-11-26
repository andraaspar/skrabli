import { mutateState } from '../c-mp/fun/useState'
import { Screen, uiStore } from '../store/uiStore'

export function onHashChange() {
	mutateState(`onHashChange [t6c2f3]`, () => {
		switch (location.hash.slice(1)) {
			case 'new':
				uiStore.screen = Screen.New
				break
			case 'game':
				uiStore.screen = Screen.Game
				break
			default:
				uiStore.screen = Screen.Menu
		}
	})
}
