import { isUndefinedOrNull } from 'illa/Type'
import { Draft, produce } from 'immer'
import {
	addTilesToBag,
	collectTiles,
	deselectTilesToReplace,
	disownTiles,
	fillHand,
	incrementSkipCount,
	nextPlayer,
	removeTilesToReplaceFromHand,
	resetGame,
	resetSkipCount,
	score,
	scoreBonuses,
	selectHand,
	setGame,
	setJokerLetter,
	setMode,
	setPlayerName,
	setSelectedField,
	swapHandAndBoard,
	swapHands,
	swapTiles,
	toggleHandIndexToReplace,
} from '../action/actions'
import { TAction } from '../action/TAction'
import { getHandTileCount } from '../fun/getHandTileCount'
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
	readonly startingHandCount: number | null
	readonly skipCount: number | null
	readonly playerBonuses: ReadonlyArray<number> | null
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
		startingHandCount: null,
		skipCount: null,
		playerBonuses: null,
	}
}

export const appStateReducer = produce(
	(state: Draft<IAppState>, action: TAction) => {
		switch (action.type) {
			case collectTiles.type: {
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
				break
			}
			case disownTiles.type: {
				for (const field of state.board) {
					if (field.tile) {
						if (field.tile.isOwned) {
							field.tile.isOwned = undefined
							field.tile.isLast = true
						} else if (field.tile.isLast) {
							field.tile.isLast = undefined
						}
					}
				}
				break
			}
			case fillHand.type: {
				const { bag, hands, playerIndex } = state
				const hand = hands[playerIndex!]
				const count = Math.min(
					bag.length,
					hand.length - getHandTileCount(hand),
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
				const newHand = (state.hands[playerIndex!] = hand.map(tile =>
					tile ? tile : tiles.shift() || null,
				))
				state.startingHandCount = getHandTileCount(newHand)
				break
			}
			case nextPlayer.type: {
				const { playerIndex } = state
				state.playerIndex = isUndefinedOrNull(playerIndex)
					? 0
					: 1 - playerIndex
				state.fieldIndex = null
				state.handIndex = null
				break
			}
			case resetGame.type:
				return createAppState()
			case score.type: {
				const { players, playerIndex } = state
				players[playerIndex!].score += action.payload
				break
			}
			case setSelectedField.type: {
				state.fieldIndex = action.payload.fieldIndex
				break
			}
			case selectHand.type: {
				state.handIndex = action.payload.handIndex
				break
			}
			case setJokerLetter.type: {
				const { board, fieldIndex } = state
				board[fieldIndex!].tile!.letter = action.payload.letter
				state.fieldIndex = null
				break
			}
			case setMode.type: {
				const mode = action.payload
				if (mode !== state.mode) {
					state.fieldIndex = null
					state.handIndex = null
				}
				state.mode = mode
				break
			}
			case setPlayerName.type: {
				const { playerIndex, name } = action.payload
				state.players[playerIndex].name = name
				break
			}
			case swapHandAndBoard.type: {
				const { board, hands, playerIndex } = state
				const { fieldIndex, handIndex } = action.payload
				const field = board[fieldIndex]
				const hand = hands[playerIndex!]
				const tileOnBoard = field.tile
				const tileInHand = hand[handIndex]
				state.fieldIndex =
					tileInHand && tileInHand.isJoker ? fieldIndex : null
				state.handIndex = null
				field.tile = tileInHand
				hand[handIndex] = tileOnBoard
				if (tileOnBoard && tileOnBoard.isJoker) {
					tileOnBoard.letter = ' '
				}
				break
			}
			case swapHands.type: {
				const { hands, playerIndex } = state
				const { handIndexA, handIndexB } = action.payload
				const hand = hands[playerIndex!]
				const tileA = hand[handIndexA]
				const tileB = hand[handIndexB]
				state.handIndex = null
				hand[handIndexA] = tileB
				hand[handIndexB] = tileA
				break
			}
			case swapTiles.type: {
				const { board } = state
				const { fieldIndexA, fieldIndexB } = action.payload
				const fieldATile = board[fieldIndexA].tile
				const fieldBTile = board[fieldIndexB].tile
				state.fieldIndex = null
				board[fieldIndexA].tile = fieldBTile
				board[fieldIndexB].tile = fieldATile
				break
			}
			case toggleHandIndexToReplace.type: {
				const { handIndicesToReplace } = state
				const { handIndex } = action.payload
				handIndicesToReplace[handIndex] = !handIndicesToReplace[
					handIndex
				]
				break
			}
			case removeTilesToReplaceFromHand.type: {
				const { handIndicesToReplace, playerIndex, hands } = state
				const hand = hands[playerIndex!]
				state.hands[playerIndex!] = hand.map((tile, index) =>
					handIndicesToReplace[index] ? null : tile,
				)
				break
			}
			case deselectTilesToReplace.type: {
				state.handIndicesToReplace.fill(false)
				break
			}
			case addTilesToBag.type: {
				state.bag.push(...action.payload.tiles)
				break
			}
			case setGame.type:
				return action.payload.game
			case incrementSkipCount.type: {
				state.skipCount = (state.skipCount || 0) + 1
				break
			}
			case resetSkipCount.type: {
				state.skipCount = 0
				break
			}
			case scoreBonuses.type: {
				state.playerBonuses = action.payload as number[]
				state.players.forEach((player, playerIndex) => {
					player.score += action.payload[playerIndex]
				})
				break
			}
			default:
		}
	},
	createAppState(),
)
