import { createAction } from 'redux-starter-kit'
import { Mode } from './Mode'

export const resetGame = createAction<{}>('ResetGame')
export const collectTiles = createAction<{}>('CollectTiles')
export const disownTiles = createAction<{}>('DisownTiles')
export const fillHand = createAction<{}>('FillHand')
export const nextPlayer = createAction<{}>('NextPlayer')
export const score = createAction<{}>('Score')
export const setJokerLetter = createAction<{}>('SetJokerLetter')
export const setMode = createAction<Mode>('SetMode')
