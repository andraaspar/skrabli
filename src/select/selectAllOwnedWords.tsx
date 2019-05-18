import { createSelector } from 'reselect'
import { getAllOwnedWords } from '../fun/getAllOwnedWords'
import { selectWordInfo } from './selectWordInfo'
import { selectBoard } from './simpleSelectors'

export const selectAllOwnedWords = createSelector(
	[selectBoard, selectWordInfo],
	getAllOwnedWords,
)
