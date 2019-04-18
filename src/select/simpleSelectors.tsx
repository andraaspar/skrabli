import { TState } from '../index'
import { IAppState } from '../model/AppState'
import { TBag } from '../model/Bag'
import { TBoard } from '../model/Board'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import { TPlayers } from '../model/Player'

export const selectBoardFromAppState = (state: IAppState): TBoard => state.board
export const selectBoardFromState = (state: TState): TBoard =>
	selectBoardFromAppState(state.app)
export const selectBagFromState = (state: TState): TBag => state.app.bag
export const selectHandsFromAppState = (state: IAppState): THands => state.hands
export const selectHandsFromState = (state: TState): THands =>
	selectHandsFromAppState(state.app)
export const selectModeFromState = (state: TState): Mode => state.app.mode
export const selectHandIndicesToReplaceFromState = (
	state: TState,
): THandIndicesToReplace => state.app.handIndicesToReplace
export const selectPlayersFromState = (state: TState): TPlayers =>
	state.app.players
export const selectPlayerIndexFromAppState = (state: IAppState) =>
	state.playerIndex
export const selectPlayerIndexFromState = (state: TState) =>
	selectPlayerIndexFromAppState(state.app)
export const selectHandIndexFromAppState = (state: IAppState) => state.handIndex
export const selectHandIndexFromState = (state: TState) =>
	selectHandIndexFromAppState(state.app)
export const selectFieldIndexFromAppState = (state: IAppState) =>
	state.fieldIndex
export const selectFieldIndexFromState = (state: TState) =>
	selectFieldIndexFromAppState(state.app)
