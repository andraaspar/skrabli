import { mutateState, useState } from '../c-mp/fun/useState'
import { disownTiles } from '../fun/disownTiles'
import { findStartFieldIndex } from '../fun/findStartFieldIndex'
import { gameNameFromPlayerInfos } from '../fun/gameNameFromPlayerInfos'
import { getAllOwnedWords } from '../fun/getAllOwnedWords'
import { getHandTileCount } from '../fun/getHandTileCount'
import { getHandValue } from '../fun/getHandValue'
import { getMoveByAiLevel } from '../fun/getMoveByAiLevel'
import { getMoveErrors } from '../fun/getMoveErrors'
import { getMoveScore } from '../fun/getMoveScore'
import { getWordAt } from '../fun/getWordAt'
import { getWordInfo } from '../fun/getWordInfo'
import { getWordString } from '../fun/getWordString'
import { jsonClone } from '../fun/jsonClone'
import { loadGame } from '../fun/loadGame'
import { loadHints } from '../fun/loadHints'
import { range } from '../fun/range'
import { storeGameToDb } from '../fun/storeGameToDb'
import { AiLevel } from '../model/AiLevel'
import { HAND_SIZE } from '../model/Constants'
import { Direction } from '../model/Direction'
import type { IField } from '../model/IField'
import { IGame } from '../model/IGame'
import type { IGameState } from '../model/IGameState'
import { IPlayerInfo } from '../model/IPlayerInfo'
import type { ITile } from '../model/ITile'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import type { IWordInfo } from '../model/IWordInfo'
import { MAX_SKIP_PER_PLAYER } from '../model/MAX_SKIP_PER_PLAYER'
import { Mode } from '../model/Mode'
import { MoveError } from '../model/MoveError'
import { type THand } from '../model/THand'
import { uiStore } from './uiStore'

export const DEFAULT_GAME_STORE = {
	version: 2,
	id: crypto.randomUUID(),
	name: '',
	playerInfos: [] as IPlayerInfo[],
	timestamp: Date.now(),
	states: [] as IGameState[],
}

export const gameStore = useState('gameStore', {
	...jsonClone(DEFAULT_GAME_STORE),

	getStarted(): boolean {
		if (!gameStore.states) {
			console.log(`[t68mry] gameStore:`, JSON.stringify(gameStore))
		}
		return gameStore.states.length > 0
	},

	getState(): IGameState {
		return (
			gameStore.states.at(-1) ?? {
				bag: [],
				board: [],
				boardSize: { height: 0, width: 0 },
				fieldIndex: null,
				handIndex: null,
				handIndicesToReplace: [],
				hands: [],
				mode: Mode.NotStarted,
				playerIndex: null,
				playerScores: [],
				skipCount: null,
				startingHandCount: null,
			}
		)
	},

	getPlayerInfo(): IPlayerInfo {
		return gameStore.playerInfos.at(gameStore.getState().playerIndex!)!
	},

	getPlayerScore(): number {
		return gameStore
			.getState()
			.playerScores.at(gameStore.getState().playerIndex!)!
	},

	getWordInfo(): IWordInfo {
		return getWordInfo(
			gameStore.getState().board,
			gameStore.getState().boardSize,
		)
	},

	getAllOwnedWords(): IField[][] {
		return getAllOwnedWords(
			gameStore.getState().board,
			gameStore.getState().boardSize,
			gameStore.getWordInfo(),
		)
	},

	getAllOwnedWordStrings(): string[] {
		return gameStore.getAllOwnedWords().map((word) => getWordString(word))
	},

	getHand(): THand | null | undefined {
		const playerIndex = gameStore.getState().playerIndex
		return playerIndex == null ? null : gameStore.getState().hands[playerIndex]
	},

	getHandTile(): ITile | null | undefined {
		const hand = gameStore.getHand()
		const handIndex = gameStore.getState().handIndex
		return hand && handIndex != null ? hand[handIndex] : null
	},

	getField(): IField | null | undefined {
		const fieldIndex = gameStore.getState().fieldIndex
		return fieldIndex == null ? null : gameStore.getState().board[fieldIndex]
	},

	getTile(): ITile | null | undefined {
		return gameStore.getField()?.tile ?? null
	},

	getStartFieldIndex(): number {
		return findStartFieldIndex(gameStore.getState().board)
	},

	getMoveErrors(): MoveError[] {
		return getMoveErrors(
			gameStore.getState().board,
			gameStore.getStartFieldIndex(),
			gameStore.getAllOwnedWords(),
			gameStore.getWordInfo(),
		)
	},

	getMoveScore(): number {
		return getMoveScore(gameStore.getAllOwnedWords(), gameStore.getIsBingo())
	},

	getHandCount(): number {
		return (gameStore.getHand() ?? []).reduce(
			(sum, tile) => sum + (tile == null ? 0 : 1),
			0,
		)
	},

	getIsBingo(): boolean {
		return (
			gameStore.getState().startingHandCount === 7 &&
			gameStore.getHandCount() === 0
		)
	},

	getEmptyHandBonus(): number {
		return gameStore
			.getState()
			.hands.reduce((sum, hand) => sum + getHandValue(hand), 0)
	},

	getPlayerBonuses(): number[] {
		return gameStore.getState().hands.map((hand) => {
			if (hand.filter((it) => it == null).length === 7) {
				return gameStore.getEmptyHandBonus()
			} else {
				return -getHandValue(hand)
			}
		})
	},

	getPlacedValidAndInvalidWords(): IValidAndInvalidWords | null {
		const state = gameStore.getState()
		const tile = gameStore.getTile()
		if (state.fieldIndex == null || !tile || tile.isOwned) return null
		const words = [
			getWordAt(
				state.board,
				state.boardSize,
				state.fieldIndex,
				Direction.Horizontal,
			).word,
			getWordAt(
				state.board,
				state.boardSize,
				state.fieldIndex,
				Direction.Vertical,
			).word,
		].filter((word) => word.length > 1)
		return {
			valid: words,
			invalid: [],
		}
	},

	getWinners(): number[] {
		if (gameStore.getState().mode !== Mode.Ended) return []
		let winningScore = -Infinity
		let winners: number[] = []
		for (
			let playerIndex = 0;
			playerIndex < gameStore.playerInfos.length;
			playerIndex++
		) {
			if (gameStore.getState().playerScores[playerIndex]! > winningScore) {
				winningScore = gameStore.getState().playerScores[playerIndex]!
				winners = [playerIndex]
			} else if (
				gameStore.getState().playerScores[playerIndex] === winningScore
			) {
				winners.push(playerIndex)
			}
		}
		return winners
	},

	getIsGameDrawn(): boolean {
		return gameStore.playerInfos.length === gameStore.getWinners().length
	},

	getWinnersNames(): string {
		const winners = gameStore.getWinners()
		if (winners.length === 0) return ``
		const winnerNames = winners.map(
			(playerIndex) => gameStore.playerInfos[playerIndex]!.name,
		)
		const last = winnerNames[winnerNames.length - 1]!
		const rest = winnerNames.slice(0, winnerNames.length - 1)
		return rest.length ? `${rest.join(', ')} és ${last}` : last
	},

	getCanSwap(): boolean {
		return gameStore.getState().bag.length >= HAND_SIZE
	},

	collectTiles() {
		mutateState(`gameStore collectTiles [5d9fb5]`, () => {
			const tiles: ITile[] = []
			for (const field of gameStore.getState().board) {
				if (field.tile && field.tile.isOwned) {
					const tile = field.tile
					field.tile = null
					tiles.push(tile)
					if (tile.isJoker) tile.letter = ' '
				}
			}
			const hand =
				gameStore.getState().hands[gameStore.getState().playerIndex!]!
			for (let i = 0; i < hand.length; i++) {
				if (hand[i] == null) {
					hand[i] = tiles.shift() || null
				}
			}
		})
	},

	disownTiles() {
		mutateState(`gameStore disownTiles [d8dc08]`, () => {
			disownTiles(gameStore.getState().board)
		})
	},

	fillHand() {
		const hand = gameStore.getState().hands[gameStore.getState().playerIndex!]!
		const count = Math.min(
			gameStore.getState().bag.length,
			hand.length - getHandTileCount(hand),
		)
		const tiles: ITile[] = []
		mutateState(`gameStore grab tiles [95be12]`, () => {
			for (let i = 0; i < count; i++) {
				const tile = gameStore
					.getState()
					.bag.splice(
						Math.floor(Math.random() * gameStore.getState().bag.length),
						1,
					)[0]!
				tile.isOwned = true
				tiles.push(tile)
			}
		})
		mutateState(`gameStore fill hand [e16ac4]`, () => {
			const newHand = (gameStore.getState().hands[
				gameStore.getState().playerIndex!
			] = hand.map((tile) => (tile ? tile : tiles.shift() || null)))
			gameStore.getState().startingHandCount = getHandTileCount(newHand)
		})
	},

	nextPlayer() {
		mutateState(`gameStore nextPlayer [500255]`, () => {
			const state = gameStore.getState()
			state.playerIndex = state.playerIndex == null ? 0 : state.playerIndex + 1
			if (state.playerIndex >= gameStore.playerInfos.length) {
				state.playerIndex = 0
			}
			state.fieldIndex = null
			state.handIndex = null
			state.hintUsed = null
		})
	},

	score() {
		mutateState(`gameStore score [8b76e2]`, () => {
			const state = gameStore.getState()
			state.playerScores[state.playerIndex!]! += gameStore.getMoveScore()
		})
	},

	setJokerLetter(letter: string) {
		mutateState(`gameStore setJokerLetter [52bd18]`, () => {
			gameStore.getState().board[
				gameStore.getState().fieldIndex!
			]!.tile!.letter = letter
			gameStore.getState().fieldIndex = null
		})
	},

	setMode(mode: Mode) {
		mutateState(`gameStore setMode [7c7dd4]`, () => {
			if (mode !== gameStore.getState().mode) {
				gameStore.getState().fieldIndex = null
				gameStore.getState().handIndex = null
			}
			gameStore.getState().mode = mode
		})
	},

	swapHandAndBoard(fieldIndex: number, handIndex: number) {
		mutateState(`gameStore swapHandAndBoard [1d5228]`, () => {
			const state = gameStore.getState()
			const hand = gameStore.getHand()
			if (!hand) return
			const tileOnBoard = state.board[fieldIndex]!.tile
			const tileInHand = hand[handIndex]!
			state.fieldIndex = tileInHand && tileInHand.isJoker ? fieldIndex : null
			state.handIndex = null
			state.board[fieldIndex]!.tile = tileInHand
			hand[handIndex] = tileOnBoard
			if (tileOnBoard && tileOnBoard.isJoker) {
				tileOnBoard.letter = ' '
			}
		})
	},

	swapHands(handIndexA: number, handIndexB: number) {
		mutateState(`gameStore swapHands [780fe2]`, () => {
			const hand =
				gameStore.getState().hands[gameStore.getState().playerIndex!]!
			const tileA = hand[handIndexA]!
			const tileB = hand[handIndexB]!
			gameStore.getState().handIndex = null
			hand[handIndexA] = tileB
			hand[handIndexB] = tileA
		})
	},

	swapTiles(fieldIndexA: number, fieldIndexB: number) {
		mutateState(`gameStore swapTiles [ad0d48]`, () => {
			const fieldATile = gameStore.getState().board[fieldIndexA]!.tile
			const fieldBTile = gameStore.getState().board[fieldIndexB]!.tile
			gameStore.getState().fieldIndex = null
			gameStore.getState().board[fieldIndexA]!.tile = fieldBTile
			gameStore.getState().board[fieldIndexB]!.tile = fieldATile
		})
	},

	toggleHandIndexToReplace(handIndex: number) {
		mutateState(`gameStore toggleHandIndexToReplace [edac8b]`, () => {
			gameStore.getState().handIndicesToReplace[handIndex] =
				!gameStore.getState().handIndicesToReplace[handIndex]
		})
	},

	removeTilesToReplaceFromHand() {
		mutateState(`gameStore removeTilesToReplaceFromHand [17ff98]`, () => {
			const hand =
				gameStore.getState().hands[gameStore.getState().playerIndex!]!
			gameStore.getState().hands[gameStore.getState().playerIndex!] = hand.map(
				(tile, index) =>
					gameStore.getState().handIndicesToReplace[index] ? null : tile,
			)
		})
	},

	deselectTilesToReplace() {
		mutateState(`gameStore deselectTilesToReplace [154336]`, () => {
			gameStore.getState().handIndicesToReplace.fill(false)
		})
	},

	addTilesToBag(tiles: ITile[]) {
		mutateState(`gameStore addTilesToBag [e1aa28]`, () => {
			gameStore.getState().bag.push(...tiles)
		})
	},

	incrementSkipCount() {
		mutateState(`gameStore incrementSkipCount [679b4b]`, () => {
			gameStore.getState().skipCount = (gameStore.getState().skipCount || 0) + 1
		})
	},

	resetSkipCount() {
		mutateState(`gameStore resetSkipCount [6071ce]`, () => {
			gameStore.getState().skipCount = 0
		})
	},

	scoreBonuses() {
		mutateState(`gameStore scoreBonuses [1ea10a]`, () => {
			for (
				let playerIndex = 0;
				playerIndex < gameStore.playerInfos.length;
				playerIndex++
			) {
				gameStore.getState().playerScores[playerIndex]! +=
					gameStore.getPlayerBonuses()[playerIndex]!
			}
		})
	},

	startGame() {
		mutateState(`gameStore set game name [773808]`, () => {
			gameStore.name = gameNameFromPlayerInfos(gameStore.playerInfos)
		})
		for (let i = 0; i < gameStore.playerInfos.length; i++) {
			gameStore.nextPlayer()
			gameStore.fillHand()
		}
		mutateState(`gameStore startGame [395e48]`, () => {
			gameStore.getState().mode = Mode.PlaceTile
		})
		gameStore.nextPlayer()
		gameStore.beginTurn()
	},

	finishMove() {
		gameStore.score()
		gameStore.disownTiles()
		gameStore.resetSkipCount()
		if (gameStore.getState().bag.length || gameStore.getHandCount()) {
			gameStore.fillHand()
			gameStore.nextPlayer()
			gameStore.beginTurn()
		} else {
			gameStore.endGame()
		}
	},

	async beginTurn() {
		if (gameStore.getPlayerInfo().aiLevel === AiLevel.Human) {
			gameStore.setUndoPoint()
			gameStore.saveGame()
		} else {
			await uiStore.lockWhile('gameStore aiMove [t6c2dn]', gameStore.aiMove)
		}
	},

	async aiMove() {
		const movesHV = await loadHints({
			board: jsonClone(gameStore.getState().board),
			boardSize: jsonClone(gameStore.getState().boardSize),
			hand: jsonClone(gameStore.getHand()!),
		})
		const moves = [...movesHV.horizontal, ...movesHV.vertical]
		if (moves.length === 0) {
			if (gameStore.getCanSwap()) {
				mutateState(
					`gameStore aiMove set handIndicesToReplace [aa4a38]`,
					() => {
						gameStore.getState().handIndicesToReplace = range(HAND_SIZE).map(
							() => true,
						)
					},
				)
				gameStore.swap()
			} else {
				gameStore.skip()
			}
		} else {
			const move = getMoveByAiLevel(moves, gameStore.getPlayerInfo().aiLevel)
			mutateState(`gameStore aiMove make move [be31b8]`, () => {
				gameStore.getState().board = move.board
				gameStore.getState().hands[gameStore.getState().playerIndex!] =
					move.hand
			})
			gameStore.finishMove()
		}
	},

	selectHand(handIndexToSelect: number): void {
		const state = gameStore.getState()
		if (state.mode === Mode.ReplaceTiles) {
			gameStore.toggleHandIndexToReplace(handIndexToSelect)
		} else {
			const field =
				state.fieldIndex != null ? state.board[state.fieldIndex] : null
			const tile = field && field.tile
			if (field && tile && tile.isOwned) {
				gameStore.swapHandAndBoard(state.fieldIndex!, handIndexToSelect)
			} else {
				if (state.handIndex === handIndexToSelect) {
					mutateState(`gameStore selectHand null [a5a3c8]`, () => {
						state.handIndex = null
					})
				} else {
					if (state.handIndex == null) {
						mutateState(`gameStore selectHand N [d4dad8]`, () => {
							state.handIndex = state.hands[state.playerIndex!]![
								handIndexToSelect
							]
								? handIndexToSelect
								: null
						})
					} else {
						gameStore.swapHands(state.handIndex, handIndexToSelect)
					}
				}
			}
		}
	},

	swap() {
		const hand = gameStore.getHand()!
		const tilesToReplace = hand.filter(
			(tile, aHandIndex) =>
				gameStore.getState().handIndicesToReplace[aHandIndex],
		) as ITile[]
		gameStore.removeTilesToReplaceFromHand()
		gameStore.deselectTilesToReplace()
		gameStore.fillHand()
		gameStore.addTilesToBag(tilesToReplace)
		gameStore.resetSkipCount()
		gameStore.setMode(Mode.PlaceTile)
		gameStore.nextPlayer()
		gameStore.beginTurn()
	},

	skip() {
		gameStore.incrementSkipCount()
		if (
			(gameStore.getState().skipCount || 0) >=
			gameStore.playerInfos.length * MAX_SKIP_PER_PLAYER
		) {
			gameStore.endGame()
		} else {
			gameStore.collectTiles()
			gameStore.nextPlayer()
			gameStore.beginTurn()
		}
	},

	endGame() {
		gameStore.scoreBonuses()
		gameStore.setMode(Mode.Ended)
		gameStore.setUndoPoint()
		gameStore.saveGame()
	},

	setUndoPoint() {
		mutateState(`gameStore setUndoPoint [419458]`, () => {
			gameStore.states.push(jsonClone(gameStore.getState()))
		})
	},

	async saveGame() {
		await uiStore.lockWhile('gameStore saveGame [t6c2dy]', async () => {
			await storeGameToDb(gameStore as IGame)
			// await new Promise<void>((resolve, reject) => {
			// 	setTimeout(resolve, 3000)
			// })
			if (uiStore.updateServiceWorker) {
				await uiStore.updateServiceWorker()
			}
		})
	},

	async loadGame(id: string) {
		await uiStore.lockWhile('gameStore loadGame [t6c2e2]', async () => {
			const game = await loadGame(id)
			if (!game) throw new Error(`[ry5ln7] Game not found!`)
			mutateState(`gameStore apply loaded game [556b1b]`, () => {
				Object.assign(gameStore, game)
			})
		})
	},
})
