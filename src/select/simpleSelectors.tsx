import { TState } from '../index'
import { IAppState } from '../model/AppState'
import { TBag } from '../model/Bag'
import { TBoard } from '../model/Board'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import { TPlayers } from '../model/Player'

export const selectBoard = (state: TState): TBoard => state.app.board
export const selectBoardFromAppState = (state: IAppState): TBoard => state.board
export const selectBag = (state: TState): TBag => state.app.bag
export const selectHands = (state: TState): THands => state.app.hands
export const selectMode = (state: TState): Mode => state.app.mode
export const selectHandIndicesToReplace = (
	state: TState,
): THandIndicesToReplace => state.app.handIndicesToReplace
export const selectPlayers = (state: TState): TPlayers => state.app.players
