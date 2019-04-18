import { createAction } from 'redux-starter-kit'
import { Mode } from './Mode'
import { ITile } from './Tile'

export const collectTiles = createAction<{}>('collectTiles')
export const disownTiles = createAction<{}>('disownTiles')
export const fillHand = createAction<{}>('fillHand')
export const nextPlayer = createAction<{}>('nextPlayer')
export const resetGame = createAction<{}>('resetGame')
export const score = createAction<{}>('score')
export const selectField = createAction<{ fieldIndex: number | null }>(
	'selectField',
)
export const selectHand = createAction<{ handIndex: number | null }>(
	'selectHand',
)
export const setJokerLetter = createAction<{ letter: string }>('setJokerLetter')
export const setMode = createAction<Mode>('setMode')
export const setPlayerName = createAction<{
	playerIndex: number
	name: string
}>('setPlayerName')
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
export const toggleHandIndexToReplace = createAction<{
	handIndex: number
}>('toggleHandIndexToReplace')
export const removeTilesToReplaceFromHand = createAction<{}>(
	'removeTilesToReplaceFromHand',
)
export const deselectTilesToReplace = createAction<{}>('deselectTilesToReplace')
export const addTilesToBag = createAction<{ tiles: ITile[] }>('addTilesToBag')
