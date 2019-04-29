import { selectHandCount } from '../select/selectHandCount'
import { selectMoveScore } from '../select/selectMoveScore'
import { selectBag } from '../select/simpleSelectors'
import { disownTiles, fillHand, resetSkipCount, score } from './actions'
import { endGameThunk } from './endGameThunk'
import { nextPlayerAndSaveThunk } from './nextPlayerAndSaveThunk'
import { ThunkValue } from './ThunkValue'

export function doneThunk(): ThunkValue {
	return (dispatch, getState) => {
		dispatch(score(selectMoveScore(getState())))
		dispatch(disownTiles())
		dispatch(resetSkipCount())
		dispatch((dispatch, getState) => {
			const state = getState()
			if (selectBag(state).length || selectHandCount(state)) {
				dispatch(fillHand())
				dispatch(nextPlayerAndSaveThunk())
			} else {
				dispatch(endGameThunk())
			}
		})
	}
}
