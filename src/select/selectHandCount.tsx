import { createSelector } from 'reselect'
import { getHandTileCount } from '../fun/getHandTileCount'
import { selectHand } from './selectHand'

export const selectHandCount = createSelector(
	[selectHand],
	getHandTileCount,
)
