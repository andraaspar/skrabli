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
export const selectHandsFromState = (state: TState): THands => state.app.hands
export const selectModeFromState = (state: TState): Mode => state.app.mode
export const selectHandIndicesToReplaceFromState = (
	state: TState,
): THandIndicesToReplace => state.app.handIndicesToReplace
export const selectPlayersFromState = (state: TState): TPlayers =>
	state.app.players
