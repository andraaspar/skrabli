import { PayloadAction, createReducer } from 'redux-starter-kit'
import { TBag, createBag } from './Bag'
import { TBoard, createBoard } from './Board'
import {
	THandIndicesToReplace,
	createHandIndicesToReplace,
} from './HandIndicesToReplace'
import { THands, createHands } from './Hands'
import { TPlayers, createPlayers } from './Player'
import {
	collectTiles,
	disownTiles,
	fillHand,
	nextPlayer,
	resetGame,
	score,
	setJokerLetter,
	setMode,
	swapHandAndBoard,
	swapHands,
	swapTiles,
} from './actions'
import { isUndefinedOrNull, withInterface } from 'illa/Type'

import { CaseReducersMapObject } from 'redux-starter-kit/src/createReducer'
import { ITile } from './Tile'
import { Mode } from './Mode'
import { getMoveScore } from '../select/getMoveScore'

export interface IAppState {
	readonly mode: Mode
	readonly players: TPlayers
	readonly playerIndex: number | null
	readonly board: TBoard
	readonly bag: TBag
	readonly fieldIndex: number | null
	readonly handIndex: number | null
	readonly hands: THands
	readonly handIndicesToReplace: THandIndicesToReplace
}

export function createAppState(): IAppState {
	return {
		mode: Mode.NotStarted,
		board: createBoard(),
		bag: createBag(),
		hands: createHands(),
		players: createPlayers(),
		playerIndex: null,
		fieldIndex: null,
		handIndex: null,
		handIndicesToReplace: createHandIndicesToReplace(),
	}
}

export const appStateReducer = createReducer(
	createAppState(),
	withInterface<CaseReducersMapObject<IAppState, PayloadAction<any>>>({
		[collectTiles.type]: (
			state,
			action: ReturnType<typeof collectTiles>,
		) => {
			const { board, playerIndex, hands } = state
			const tiles: ITile[] = []
			for (const field of board) {
				if (field.tile && field.tile.isOwned) {
					const tile = field.tile
					field.tile = null
					tiles.push(tile)
					if (tile.isJoker) tile.letter = ' '
				}
			}
			const hand = hands[playerIndex!]
			for (let i = 0; i < hand.length; i++) {
				if (isUndefinedOrNull(hand[i])) {
					hand[i] = tiles.shift() || null
				}
			}
		},
		[disownTiles.type]: (state, action: ReturnType<typeof disownTiles>) => {
			for (const field of state.board) {
				if (field.tile) {
					field.tile.isOwned = false
				}
			}
		},
		[fillHand.type]: (state, action: ReturnType<typeof fillHand>) => {
			const { bag, hands, playerIndex } = state
			const hand = hands[playerIndex!]
			const count = Math.min(
				bag.length,
				hand.reduce((sum, tile) => (tile ? sum : sum + 1), 0),
			)
			const tiles: ITile[] = []
			for (let i = 0; i < count; i++) {
				const tile = bag.splice(
					Math.floor(Math.random() * bag.length),
					1,
				)[0]
				tile.isOwned = true
				tiles.push(tile)
			}
			state.hands[playerIndex!] = hand.map(tile =>
				tile ? tile : tiles.shift() || null,
			)
		},
		[nextPlayer.type]: (state, action: ReturnType<typeof nextPlayer>) => {
			const { playerIndex } = state
			state.playerIndex = isUndefinedOrNull(playerIndex)
				? 0
				: 1 - playerIndex
			state.fieldIndex = null
			state.handIndex = null
		},
		[resetGame.type]: (state, action: ReturnType<typeof resetGame>) => {
			return createAppState()
		},
		[score.type]: (state, action: ReturnType<typeof score>) => {
			const { players, playerIndex, board } = state
			players[playerIndex!].score += getMoveScore(board)
		},
		[setJokerLetter.type]: (
			state,
			action: ReturnType<typeof setJokerLetter>,
		) => {
			const { board, fieldIndex } = state
			board[fieldIndex!].tile!.letter = action.payload.letter
			state.fieldIndex = null
		},
		[setMode.type]: (state, action: ReturnType<typeof setMode>) => {
			const mode = action.payload
			if (mode !== state.mode) {
				state.fieldIndex = null
				state.handIndex = null
			}
			state.mode = mode
		},
		[swapHandAndBoard.type]: (
			state,
			action: ReturnType<typeof swapHandAndBoard>,
		) => {
			const { board, hands, playerIndex } = state
			const { fieldIndex, handIndex } = action.payload
			const field = board[fieldIndex]
			const hand = hands[playerIndex!]
			const tileOnBoard = field.tile
			const tileInHand = hand[handIndex]
			state.fieldIndex = null
			state.handIndex = null
			board[fieldIndex].tile = tileInHand
			hand[handIndex] = tileOnBoard
			if (tileOnBoard && tileOnBoard.isJoker) {
				tileOnBoard.letter = ' '
			}
		},
		[swapHands.type]: (state, action: ReturnType<typeof swapHands>) => {
			const { hands, playerIndex } = state
			const { handIndexA, handIndexB } = action.payload
			const hand = hands[playerIndex!]
			const tileA = hand[handIndexA]
			const tileB = hand[handIndexB]
			state.handIndex = null
			hand[handIndexA] = tileB
			hand[handIndexB] = tileA
		},
		[swapTiles.type]: (state, action: ReturnType<typeof swapTiles>) => {
			const { board } = state
			const { fieldIndexA, fieldIndexB } = action.payload
			const fieldA = board[fieldIndexA]
			const fieldB = board[fieldIndexB]
			state.fieldIndex = null
			board[fieldIndexA].tile = fieldB.tile
			board[fieldIndexB].tile = fieldA.tile
		},
	}),
)
