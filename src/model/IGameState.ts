import { Mode } from '../model/Mode'
import { type TBag } from '../model/TBag'
import type { TBoard } from '../model/TBoard'
import { type THands } from '../model/THands'
import { IBoardSize } from './IBoardSize'

export interface IGameState1 {
	mode: Mode
	players: { name: string; score: number }[]
	playerIndex: number | null
	board: TBoard
	boardSize: IBoardSize
	bag: TBag
	fieldIndex: number | null
	handIndex: number | null
	hands: THands
	handIndicesToReplace: boolean[]
	startingHandCount: number | null
	skipCount: number | null
}

export interface IGameState {
	mode: Mode
	playerScores: number[]
	playerIndex: number | null
	board: TBoard
	boardSize: IBoardSize
	bag: TBag
	fieldIndex: number | null
	handIndex: number | null
	hands: THands
	handIndicesToReplace: boolean[]
	startingHandCount: number | null
	skipCount: number | null
	hintUsed?: boolean | null
}
