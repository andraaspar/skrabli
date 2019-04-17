import { Mode } from './Mode'
import { createAction } from 'redux-starter-kit'

export const collectTiles = createAction<{}>('collectTiles')
export const disownTiles = createAction<{}>('disownTiles')
export const fillHand = createAction<{}>('fillHand')
export const nextPlayer = createAction<{}>('nextPlayer')
export const resetGame = createAction<{}>('resetGame')
export const score = createAction<{}>('score')
export const setJokerLetter = createAction<{ letter: string }>('setJokerLetter')
export const setMode = createAction<Mode>('setMode')
export const swapHandAndBoard = createAction<{
	fieldIndex: number
	handIndex: number
}>('swapHandAndBoard')
export const swapHands = createAction<{
	handIndexA: number
	handIndexB: number
}>('swapHands')
export const swapTiles = createAction<{
	fieldIndexA: number
	fieldIndexB: number
}>('swapTiles')
