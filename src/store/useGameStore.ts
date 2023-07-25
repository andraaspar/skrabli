import { disownTiles } from '@/fun/disownTiles'
import { findStartFieldIndex } from '@/fun/findStartFieldIndex'
import { gameNameFromPlayerInfos } from '@/fun/gameNameFromPlayerInfos'
import { getAllOwnedWords } from '@/fun/getAllOwnedWords'
import { getHandValue } from '@/fun/getHandValue'
import { getMoveErrors } from '@/fun/getMoveErrors'
import { getMoveScore } from '@/fun/getMoveScore'
import { getWordInfo } from '@/fun/getWordInfo'
import { getWordString } from '@/fun/getWordString'
import { jsonClone } from '@/fun/jsonClone'
import { loadGame } from '@/fun/loadGame'
import { storeGameToDb } from '@/fun/storeGameToDb'
import { AiLevel } from '@/model/AiLevel'
import type { IGame } from '@/model/IGame'
import type { IPlayerInfo } from '@/model/IPlayerInfo'
import type { IValidAndInvalidWords } from '@/model/IValidAndInvalidWords'
import { MoveError } from '@/model/MoveError'
import { defineStore } from 'pinia'
import { v4 } from 'uuid'
import { getHandTileCount } from '../fun/getHandTileCount'
import { getWordAt } from '../fun/getWordAt'
import { range } from '../fun/range'
import { withInterface } from '../fun/withInterface'
import { BOARD_SIZE } from '../model/Constants'
import { Direction } from '../model/Direction'
import { FieldKind } from '../model/FieldKind'
import type { IField } from '../model/IField'
import type { IGameState } from '../model/IGameState'
import type { ITile } from '../model/ITile'
import type { IWordInfo } from '../model/IWordInfo'
import { LETTERS } from '../model/LETTERS'
import { Mode } from '../model/Mode'
import { type THand } from '../model/THand'
import { useUiStore } from './useUiStore'

export const useGameStore = defineStore('game', {
	state: (): IGame => {
		const playerInfos: IPlayerInfo[] = [
			{
				aiLevel: AiLevel.Human,
				name: '1. Játékos',
			},
			{
				aiLevel: AiLevel.Human,
				name: '2. Játékos',
			},
		]
		return {
			id: v4(),
			name: gameNameFromPlayerInfos(playerInfos),
			playerInfos: playerInfos,
			timestamp: Date.now(),
			states: [
				{
					mode: Mode.NotStarted,
					playerScores: [0, 0],
					hands: range(2).map(() => range(7).map(() => null)),
					playerIndex: null,
					fieldIndex: null,
					handIndex: null,
					startingHandCount: null,
					skipCount: null,
					handIndicesToReplace: range(7).map(() => false),
					board: `
W--l---W---l--W
-w---L---L---w-
--w---l-l---w--
l--w---l---w--l
----w-----w----
-L---L---L---L-
--l---l-l---l--
W--l---s---l--W
--l---l-l---l--
-L---L---L---L-
----w-----w----
l--w---l---w--l
--w---l-l---w--
-w---L---L---w-
W--l---W---l--W
`
						.trim()
						.split(/\n/)
						.flatMap((row) =>
							row.split('').map((letter) =>
								withInterface<IField>({
									kind: letter as FieldKind,
									tile: null,
								}),
							),
						),
					boardSize: { width: BOARD_SIZE, height: BOARD_SIZE },
					bag: LETTERS.flatMap(({ count, letter, score }) =>
						range(count).map(() =>
							withInterface<ITile>({
								letter,
								score,
								isOwned: undefined,
								isJoker: letter === ' ' || undefined,
								isLast: undefined,
							}),
						),
					),
				},
			],
		}
	},
	getters: {
		state(): IGameState {
			return this.states.at(-1)!
		},
		wordInfo(): IWordInfo {
			return getWordInfo(this.state.board, this.state.boardSize)
		},

		allOwnedWords(): IField[][] {
			return getAllOwnedWords(
				this.state.board,
				this.state.boardSize,
				this.wordInfo,
			)
		},

		allOwnedWordStrings(): string[] {
			return this.allOwnedWords.map((word) => getWordString(word))
		},

		hand(): THand | null {
			return this.state.playerIndex == null
				? null
				: this.state.hands[this.state.playerIndex]
		},

		handTile(): ITile | null {
			return this.hand && this.state.handIndex != null
				? this.hand[this.state.handIndex]
				: null
		},

		field(): IField | null {
			return this.state.fieldIndex == null
				? null
				: this.state.board[this.state.fieldIndex]
		},

		tile(): ITile | null {
			return this.field?.tile ?? null
		},

		startFieldIndex(): number {
			return findStartFieldIndex(this.state.board)
		},

		moveErrors(): MoveError[] {
			return getMoveErrors(
				this.state.board,
				this.startFieldIndex,
				this.allOwnedWords,
				this.wordInfo,
			)
		},

		moveScore(): number {
			return getMoveScore(this.allOwnedWords, this.isBingo)
		},

		handCount(): number {
			return (this.hand ?? []).reduce(
				(sum, tile) => sum + (tile == null ? 0 : 1),
				0,
			)
		},

		isBingo(): boolean {
			return this.state.startingHandCount === 7 && this.handCount === 0
		},

		emptyHandBonus(): number {
			return this.state.hands.reduce((sum, hand) => sum + getHandValue(hand), 0)
		},

		playerBonuses(): number[] {
			return this.state.hands.map((hand) => {
				if (hand.filter((it) => it == null).length === 7) {
					return this.emptyHandBonus
				} else {
					return -getHandValue(hand)
				}
			})
		},

		placedValidAndInvalidWords(): IValidAndInvalidWords | null {
			if (this.state.fieldIndex == null || !this.tile || this.tile.isOwned)
				return null
			const words = [
				getWordAt(
					this.state.board,
					this.state.boardSize,
					this.state.fieldIndex,
					Direction.Horizontal,
				).word,
				getWordAt(
					this.state.board,
					this.state.boardSize,
					this.state.fieldIndex,
					Direction.Vertical,
				).word,
			].filter((word) => word.length > 1)
			return {
				valid: words,
				invalid: [],
			}
		},

		winners(): number[] {
			if (this.state.mode !== Mode.Ended) return []
			let winningScore = -Infinity
			let winners: number[] = []
			for (
				let playerIndex = 0;
				playerIndex < this.playerInfos.length;
				playerIndex++
			) {
				if (this.state.playerScores[playerIndex] > winningScore) {
					winningScore = this.state.playerScores[playerIndex]
					winners = [playerIndex]
				} else if (this.state.playerScores[playerIndex] === winningScore) {
					winners.push(playerIndex)
				}
			}
			return winners
		},

		isGameDrawn(): boolean {
			return this.playerInfos.length === this.winners.length
		},

		winnersNames(): string {
			if (this.winners.length === 0) return ``
			const winnerNames = this.winners.map(
				(playerIndex) => this.playerInfos[playerIndex].name,
			)
			const last = winnerNames[winnerNames.length - 1]
			const rest = winnerNames.slice(0, winnerNames.length - 1)
			return rest.length ? `${rest.join(', ')} és ${last}` : last
		},
	},
	actions: {
		collectTiles() {
			const tiles: ITile[] = []
			for (const field of this.state.board) {
				if (field.tile && field.tile.isOwned) {
					const tile = field.tile
					field.tile = null
					tiles.push(tile)
					if (tile.isJoker) tile.letter = ' '
				}
			}
			const hand = this.state.hands[this.state.playerIndex!]
			for (let i = 0; i < hand.length; i++) {
				if (hand[i] == null) {
					hand[i] = tiles.shift() || null
				}
			}
		},

		disownTiles() {
			disownTiles(this.state.board)
		},

		fillHand() {
			const hand = this.state.hands[this.state.playerIndex!]
			const count = Math.min(
				this.state.bag.length,
				hand.length - getHandTileCount(hand),
			)
			const tiles: ITile[] = []
			for (let i = 0; i < count; i++) {
				const tile = this.state.bag.splice(
					Math.floor(Math.random() * this.state.bag.length),
					1,
				)[0]
				tile.isOwned = true
				tiles.push(tile)
			}
			const newHand = (this.state.hands[this.state.playerIndex!] = hand.map(
				(tile) => (tile ? tile : tiles.shift() || null),
			))
			this.state.startingHandCount = getHandTileCount(newHand)
		},

		nextPlayer() {
			this.state.playerIndex =
				this.state.playerIndex == null ? 0 : this.state.playerIndex + 1
			if (this.state.playerIndex >= this.playerInfos.length) {
				this.state.playerIndex = 0
			}
			this.state.fieldIndex = null
			this.state.handIndex = null
		},

		score() {
			this.state.playerScores[this.state.playerIndex!] += this.moveScore
		},

		setJokerLetter(letter: string) {
			this.state.board[this.state.fieldIndex!].tile!.letter = letter
			this.state.fieldIndex = null
		},

		setMode(mode: Mode) {
			if (mode !== this.state.mode) {
				this.state.fieldIndex = null
				this.state.handIndex = null
			}
			this.state.mode = mode
		},

		swapHandAndBoard(fieldIndex: number, handIndex: number) {
			const tileOnBoard = this.state.board[fieldIndex].tile
			const tileInHand = this.hand![handIndex]
			this.state.fieldIndex =
				tileInHand && tileInHand.isJoker ? fieldIndex : null
			this.state.handIndex = null
			this.state.board[fieldIndex].tile = tileInHand
			this.hand![handIndex] = tileOnBoard
			if (tileOnBoard && tileOnBoard.isJoker) {
				tileOnBoard.letter = ' '
			}
		},

		swapHands(handIndexA: number, handIndexB: number) {
			const hand = this.state.hands[this.state.playerIndex!]
			const tileA = hand[handIndexA]
			const tileB = hand[handIndexB]
			this.state.handIndex = null
			hand[handIndexA] = tileB
			hand[handIndexB] = tileA
		},

		swapTiles(fieldIndexA: number, fieldIndexB: number) {
			const fieldATile = this.state.board[fieldIndexA].tile
			const fieldBTile = this.state.board[fieldIndexB].tile
			this.state.fieldIndex = null
			this.state.board[fieldIndexA].tile = fieldBTile
			this.state.board[fieldIndexB].tile = fieldATile
		},

		toggleHandIndexToReplace(handIndex: number) {
			this.state.handIndicesToReplace[handIndex] =
				!this.state.handIndicesToReplace[handIndex]
		},

		removeTilesToReplaceFromHand() {
			const hand = this.state.hands[this.state.playerIndex!]
			this.state.hands[this.state.playerIndex!] = hand.map((tile, index) =>
				this.state.handIndicesToReplace[index] ? null : tile,
			)
		},

		deselectTilesToReplace() {
			this.state.handIndicesToReplace.fill(false)
		},

		addTilesToBag(tiles: ITile[]) {
			this.state.bag.push(...tiles)
		},

		incrementSkipCount() {
			this.state.skipCount = (this.state.skipCount || 0) + 1
		},

		resetSkipCount() {
			this.state.skipCount = 0
		},

		scoreBonuses() {
			this.playerInfos.forEach((player, playerIndex) => {
				this.state.playerScores[playerIndex] += this.playerBonuses[playerIndex]
			})
		},

		newGame() {
			const names = this.playerInfos.map((player) => player.name)
			this.$reset()
			names.forEach((name, playerIndex) => {
				this.playerInfos[playerIndex].name = name
			})
		},

		startGame() {
			this.name = gameNameFromPlayerInfos(this.playerInfos)
			this.playerInfos.forEach(() => {
				this.nextPlayer()
				this.fillHand()
			})
			this.state.mode = Mode.PlaceTile
			this.nextPlayer()
			this.setUndoPoint()
			this.saveGame()
		},

		selectHand(handIndexToSelect: number): void {
			if (this.state.mode === Mode.ReplaceTiles) {
				this.toggleHandIndexToReplace(handIndexToSelect)
			} else {
				const field =
					this.state.fieldIndex != null
						? this.state.board[this.state.fieldIndex]
						: null
				const tile = field && field.tile
				if (field && tile && tile.isOwned) {
					this.swapHandAndBoard(this.state.fieldIndex!, handIndexToSelect)
				} else {
					if (this.state.handIndex === handIndexToSelect) {
						this.state.handIndex = null
					} else {
						if (this.state.handIndex == null) {
							this.state.handIndex = this.state.hands[this.state.playerIndex!][
								handIndexToSelect
							]
								? handIndexToSelect
								: null
						} else {
							this.swapHands(this.state.handIndex, handIndexToSelect)
						}
					}
				}
			}
		},

		skip() {
			this.incrementSkipCount()
			if ((this.state.skipCount || 0) >= this.playerInfos.length * 2) {
				this.endGame()
			} else {
				this.collectTiles()
				this.nextPlayer()
				this.setUndoPoint()
				this.saveGame()
			}
		},

		endGame() {
			this.scoreBonuses()
			this.setMode(Mode.Ended)
			this.setUndoPoint()
			this.saveGame()
		},

		setUndoPoint() {
			this.states.push(jsonClone(this.state))
		},

		async saveGame() {
			const uiStore = useUiStore()
			await uiStore.lockWhile(() => storeGameToDb(this.$state))
		},

		async loadGame(id: string) {
			const uiStore = useUiStore()
			await uiStore.lockWhile(async () => {
				const game = await loadGame(id)
				if (!game) throw new Error(`[ry5ln7] Game not found!`)
				this.$patch(game)
			})
		},
	},
})

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
// }
