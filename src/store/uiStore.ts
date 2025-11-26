import { mutateState, useState } from '../c-mp/fun/useState'
import { IConfirm } from '../model/IConfirm'

export const enum Screen {
	Menu = 'Menu',
	New = 'New',
	Game = 'Game',
}

export const uiStore = useState('uiStore', {
	hash: '',
	screen: Screen.Menu,
	lockedCount: 0,
	error: '',
	updateServiceWorker: undefined as undefined | (() => Promise<void>),
	confirm: undefined as IConfirm | undefined,

	isLocked(): boolean {
		return this.lockedCount > 0
	},

	async lockWhile(name: string, fn: () => Promise<void>) {
		try {
			mutateState(`${name} increment lockedCount [t62otg]`, () => {
				this.lockedCount++
			})
			await fn()
		} catch (e) {
			console.error(e)
			mutateState(`${name} set error [t62otc]`, () => {
				this.error = e + ''
			})
		} finally {
			mutateState(`${name} decrement lockedCount [t62otj]`, () => {
				this.lockedCount--
			})
		}
	},
})
