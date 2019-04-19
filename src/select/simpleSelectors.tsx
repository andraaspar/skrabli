import { IAppState } from '../model/AppState'
import { TBag } from '../model/Bag'
import { TBoard } from '../model/Board'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import { TPlayers } from '../model/Player'
import { IState } from '../model/State'

export const selectBoardFromAppState = (state: IAppState): TBoard => state.board
export const selectBoardFromState = (state: IState): TBoard =>
	selectBoardFromAppState(state.app)
export const selectBagFromState = (state: IState): TBag => state.app.bag
export const selectHandsFromAppState = (state: IAppState): THands => state.hands
export const selectHandsFromState = (state: IState): THands =>
	selectHandsFromAppState(state.app)
export const selectModeFromState = (state: IState): Mode => state.app.mode
export const selectHandIndicesToReplaceFromState = (
	state: IState,
): THandIndicesToReplace => state.app.handIndicesToReplace
export const selectPlayersFromState = (state: IState): TPlayers =>
	state.app.players
export const selectPlayerIndexFromAppState = (state: IAppState) =>
	state.playerIndex
export const selectPlayerIndexFromState = (state: IState) =>
	selectPlayerIndexFromAppState(state.app)
export const selectHandIndexFromAppState = (state: IAppState) => state.handIndex
export const selectHandIndexFromState = (state: IState) =>
	selectHandIndexFromAppState(state.app)
export const selectFieldIndexFromAppState = (state: IAppState) =>
	state.fieldIndex
export const selectFieldIndexFromState = (state: IState) =>
	selectFieldIndexFromAppState(state.app)
export const selectStartingHandCountFromAppState = (state: IAppState) =>
	state.startingHandCount
export const selectStartingHandCountFromState = (state: IState) =>
	selectStartingHandCountFromAppState(state.app)
