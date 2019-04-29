import { createSelector } from 'reselect'
import { selectHandCount } from './selectHandCount'
import { selectStartingHandCount } from './simpleSelectors'

export const selectIsBingo = createSelector(
	[selectStartingHandCount, selectHandCount],
	(startingHandCount, handCount) => {
		return startingHandCount === 7 && handCount === 0
	},
)
