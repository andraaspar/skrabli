import { IAppState } from '../model/AppState'
import { IWordsValidity } from '../model/IWordsValidity'
import { Mode } from '../model/Mode'
import { TLoadable } from '../model/TLoadable'
import { ITile } from '../model/Tile'

export const setGame = createAction<'setGame', { game: IAppState }>('setGame')
export const collectTiles = createAction<'collectTiles'>('collectTiles')
export const disownTiles = createAction<'disownTiles'>('disownTiles')
export const fillHand = createAction<'fillHand'>('fillHand')
export const nextPlayer = createAction<'nextPlayer'>('nextPlayer')
export const resetGame = createAction<'resetGame'>('resetGame')
export const score = createAction<'score', number>('score')
export const setSelectedField = createAction<
	'setSelectedField',
	{ fieldIndex: number | null }
>('setSelectedField')
export const selectHand = createAction<
	'selectHand',
	{ handIndex: number | null }
>('selectHand')
export const setJokerLetter = createAction<
	'setJokerLetter',
	{ letter: string }
>('setJokerLetter')
export const setMode = createAction<'setMode', Mode>('setMode')
export const setPlayerName = createAction<
	'setPlayerName',
	{
		playerIndex: number
		name: string
	}
>('setPlayerName')
export const swapHandAndBoard = createAction<
	'swapHandAndBoard',
	{
		fieldIndex: number
		handIndex: number
	}
>('swapHandAndBoard')
export const swapHands = createAction<
	'swapHands',
	{
		handIndexA: number
		handIndexB: number
	}
>('swapHands')
export const swapTiles = createAction<
	'swapTiles',
	{
		fieldIndexA: number
		fieldIndexB: number
	}
>('swapTiles')
export const toggleHandIndexToReplace = createAction<
	'toggleHandIndexToReplace',
	{
		handIndex: number
	}
>('toggleHandIndexToReplace')
export const removeTilesToReplaceFromHand =
	createAction<'removeTilesToReplaceFromHand'>('removeTilesToReplaceFromHand')
export const deselectTilesToReplace = createAction<'deselectTilesToReplace'>(
	'deselectTilesToReplace',
)
export const addTilesToBag = createAction<'addTilesToBag', { tiles: ITile[] }>(
	'addTilesToBag',
)
export const incrementSkipCount =
	createAction<'incrementSkipCount'>('incrementSkipCount')
export const resetSkipCount = createAction<'resetSkipCount'>('resetSkipCount')
export const scoreBonuses = createAction<'scoreBonuses', ReadonlyArray<number>>(
	'scoreBonuses',
)
export const setWordsValidity = createAction<
	'wordsValidity',
	TLoadable<IWordsValidity>
>('wordsValidity')

function createAction<T extends string, P = void>(type: T) {
	const a = (payload: P) => ({ type, payload })
	a.type = type
	return a
}
