import { IAppState } from '../model/AppState'
import { TBag } from '../model/Bag'
import { TBoard } from '../model/Board'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'

export const selectBoard = (state: IAppState): TBoard => state.board
export const selectBag = (state: IAppState): TBag => state.bag
export const selectHands = (state: IAppState): THands => state.hands
export const selectMode = (state: IAppState): Mode => state.mode
export const selectHandIndicesToReplace = (
	state: IAppState,
): THandIndicesToReplace => state.handIndicesToReplace
export const selectPlayers = (state: IAppState) => state.players
export const selectPlayerIndex = (state: IAppState) => state.playerIndex
export const selectHandIndex = (state: IAppState) => state.handIndex
export const selectFieldIndex = (state: IAppState) => state.fieldIndex
export const selectStartingHandCount = (state: IAppState) =>
	state.startingHandCount
export const selectWordsValidity = (state: IAppState) => state.wordsValidity
