import { TSetStateReducer } from '../model/TSetStateReducer'
import { createState } from './createState'

export function resetGame(): TSetStateReducer {
	return state => ({
		...createState(),
	})
}
