import { isUndefinedOrNull } from 'illa/Type'
import { createReducer } from 'redux-starter-kit'
import { fillHand, nextPlayer, resetGame, setMode } from './actions'
import { createBag, TBag } from './Bag'
import { createBoard, TBoard } from './Board'
import {
	createHandIndicesToReplace,
	THandIndicesToReplace,
} from './HandIndicesToReplace'
import { createHands, THands } from './Hands'
import { Mode } from './Mode'
import { createPlayers, TPlayers } from './Player'
import { ITile } from './Tile'

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

export const appStateReducer = createReducer(createAppState(), {
	[resetGame.type]: (state, action: ReturnType<typeof resetGame>) => {
		return createAppState()
	},
	[nextPlayer.type]: (state, action: ReturnType<typeof nextPlayer>) => {
		const { playerIndex } = state
		state.playerIndex = isUndefinedOrNull(playerIndex) ? 0 : 1 - playerIndex
		state.fieldIndex = null
		state.handIndex = null
	},
	[setMode.type]: (state, action: ReturnType<typeof setMode>) => {
		const mode = action.payload
		if (mode !== state.mode) {
			state.fieldIndex = null
			state.handIndex = null
		}
		state.mode = mode
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
})
