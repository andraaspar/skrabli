import { getHandValue } from '@/fun/getHandValue'
import { getFieldIndexOffset } from '@/fun/getNextFieldIndex'
import { getNoError } from '@/fun/getNoError'
import { getWordScore } from '@/fun/getWordScore'
import { getWordString } from '@/fun/getWordString'
import { theOtherDirection } from '@/fun/theOtherDirection'
import type { IValidAndInvalidWords } from '@/model/IValidAndInvalidWords'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import { MoveError } from '@/model/MoveError'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getColumnIndex } from '../fun/getColumnIndex'
import { getHandTileCount } from '../fun/getHandTileCount'
import { getRowIndex } from '../fun/getRowIndex'
import { getWordAt } from '../fun/getWordAt'
import { isThereAGap } from '../fun/isThereAGap'
import { range } from '../fun/range'
import { withInterface } from '../fun/withInterface'
import { BINGO_SCORE, BOARD_SIZE, CENTER_FIELD_INDEX } from '../model/Constants'
import { Direction } from '../model/Direction'
import { FieldKind } from '../model/FieldKind'
import type { IField } from '../model/IField'
import type { IPlayer } from '../model/IPlayer'
import type { ITile } from '../model/ITile'
import type { IWordInfo } from '../model/IWordInfo'
import { LETTERS } from '../model/LETTERS'
import { Mode } from '../model/Mode'
import { type TBag } from '../model/TBag'
import type { TBoard } from '../model/TBoard'
import { type THand } from '../model/THand'
import { type THands } from '../model/THands'

export interface IState {
	mode: Mode
	players: IPlayer[]
	playerIndex: number | null
	board: TBoard
	bag: TBag
	fieldIndex: number | null
	handIndex: number | null
	hands: THands
	handIndicesToReplace: boolean[]
	startingHandCount: number | null
	skipCount: number | null
}

export const useStore = defineStore('game', {
	state: (): IState => ({
		mode: Mode.NotStarted,
		players: [
			{
				name: '1. Játékos',
				score: 0,
			},
			{
				name: '2. Játékos',
				score: 0,
			},
		],
		hands: range(2).map((_) => range(7).map((_) => null)),
		playerIndex: null,
		fieldIndex: null,
		handIndex: null,
		startingHandCount: null,
		skipCount: null,
		handIndicesToReplace: range(7).map((_) => false),
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
		bag: LETTERS.flatMap(({ count, letter, score }) =>
			range(count).map((_) =>
				withInterface<ITile>({
					letter,
					score,
					isOwned: undefined,
					isJoker: letter === ' ' || undefined,
					isLast: undefined,
				}),
			),
		),
	}),
	getters: {
		wordInfo(): IWordInfo {
			let firstFieldIndex: number | null = null
			let lastFieldIndex: number | null = null
			let colIndex: number | null = null
			let rowIndex: number | null = null
			let direction: Direction | null = null

			for (let fieldIndex = 0; fieldIndex < this.board.length; fieldIndex++) {
				const field = this.board[fieldIndex]
				if (field.tile && field.tile.isOwned) {
					if (colIndex == null) {
						// First field
						firstFieldIndex = fieldIndex
						lastFieldIndex = fieldIndex
						colIndex = getColumnIndex(fieldIndex)
						rowIndex = getRowIndex(fieldIndex)
					} else {
						const newColIndex = getColumnIndex(fieldIndex)
						const newRowIndex = getRowIndex(fieldIndex)
						if (lastFieldIndex === firstFieldIndex) {
							// Second field
							if (colIndex === newColIndex) {
								direction = Direction.Vertical
							} else if (rowIndex === newRowIndex) {
								direction = Direction.Horizontal
							}
						} else {
							// Third+ field
							if (
								(direction === Direction.Vertical &&
									colIndex !== newColIndex) ||
								(direction === Direction.Horizontal && rowIndex !== newRowIndex)
							) {
								direction = null
							}
						}
						colIndex = newColIndex
						rowIndex = newRowIndex
						lastFieldIndex = fieldIndex
					}
				}
			}
			if (firstFieldIndex != null) {
				const horizontal = getWordAt(
					this.board,
					firstFieldIndex,
					Direction.Horizontal,
				)
				const vertical = getWordAt(
					this.board,
					firstFieldIndex,
					Direction.Vertical,
				)
				if (firstFieldIndex === lastFieldIndex) {
					if (horizontal.word.length) {
						direction = Direction.Horizontal
					} else if (vertical.word.length) {
						direction = Direction.Vertical
					}
				}
				if (direction === Direction.Horizontal) {
					firstFieldIndex = Math.min(
						firstFieldIndex,
						getRowIndex(firstFieldIndex) * BOARD_SIZE +
							horizontal.startLineIndex,
					)
					lastFieldIndex = Math.max(
						lastFieldIndex!,
						getRowIndex(firstFieldIndex) * BOARD_SIZE + horizontal.endLineIndex,
					)
				} else if (direction === Direction.Vertical) {
					firstFieldIndex = Math.min(
						firstFieldIndex,
						vertical.startLineIndex * BOARD_SIZE +
							getColumnIndex(firstFieldIndex),
					)
					lastFieldIndex = Math.max(
						lastFieldIndex!,
						vertical.endLineIndex * BOARD_SIZE +
							getColumnIndex(firstFieldIndex),
					)
				}
			}
			if (
				firstFieldIndex != null &&
				lastFieldIndex != null &&
				direction != null &&
				isThereAGap(this.board, firstFieldIndex, lastFieldIndex, direction)
			) {
				direction = null
			}
			return {
				firstFieldIndex,
				lastFieldIndex,
				direction,
			}
		},

		allOwnedWords(): IField[][] {
			const words: IField[][] = []
			const { firstFieldIndex, lastFieldIndex, direction } = this.wordInfo
			if (
				firstFieldIndex != null &&
				lastFieldIndex != null &&
				direction != null
			) {
				words.push(getWordAt(this.board, firstFieldIndex, direction).word)
				let fieldIndex = firstFieldIndex
				let field = this.board[fieldIndex]
				while (field && field.tile) {
					if (field.tile.isOwned) {
						words.push(
							getWordAt(this.board, fieldIndex, theOtherDirection(direction))
								.word,
						)
					}
					fieldIndex += getFieldIndexOffset(direction)
					if (fieldIndex > lastFieldIndex) break
					field = this.board[fieldIndex]
				}
			}
			return words.filter((_) => _.length > 0)
		},

		allOwnedWordStrings(): string[] {
			return this.allOwnedWords.map((word) => getWordString(word))
		},

		hand(): THand | null {
			return this.playerIndex == null ? null : this.hands[this.playerIndex]
		},

		handTile(): ITile | null {
			return this.hand && this.handIndex != null
				? this.hand[this.handIndex]
				: null
		},

		field(): IField | null {
			return this.fieldIndex == null ? null : this.board[this.fieldIndex]
		},

		tile(): ITile | null {
			return this.field?.tile ?? null
		},

		moveErrors(): MoveError[] {
			const errors: Set<MoveError> = new Set()
			const { firstFieldIndex, lastFieldIndex, direction } = this.wordInfo
			if (firstFieldIndex == null) {
				errors.add(MoveError.NoTile)
			}
			if (errors.size === 0) {
				if (firstFieldIndex === lastFieldIndex) {
					errors.add(MoveError.OneTile)
				}
				if (errors.size === 0) {
					if (direction == null) {
						errors.add(MoveError.NoDirection)
					}
					if (errors.size === 0) {
						let touchesStart = false
						let touchesUnowned = false
						for (const word of this.allOwnedWords) {
							// if (!isWordStringValid(getWordString(word))) {
							// 	errors.add(MoveError.InvalidWord)
							// }
							for (const field of word) {
								if (field.kind === FieldKind.Start) {
									touchesStart = true
								}
								if (field.tile && !field.tile.isOwned) {
									touchesUnowned = true
								}
							}
						}
						if (this.board[CENTER_FIELD_INDEX].tile == null) {
							errors.add(MoveError.NoStart)
						} else if (!touchesUnowned && !touchesStart) {
							errors.add(MoveError.NoConnection)
						}
					}
				}
			}
			return Array.from(errors)
		},

		moveScore(): number {
			let score = 0
			for (let word of this.allOwnedWords) {
				score += getWordScore(word)
			}
			if (this.isBingo) score += BINGO_SCORE
			return score
		},

		handCount(): number {
			return (this.hand ?? []).reduce(
				(sum, tile) => sum + (tile == null ? 0 : 1),
				0,
			)
		},

		isBingo(): boolean {
			return this.startingHandCount === 7 && this.handCount === 0
		},

		emptyHandBonus(): number {
			return this.hands.reduce((sum, hand) => sum + getHandValue(hand), 0)
		},

		playerBonuses(): number[] {
			return this.hands.map((hand) => {
				if (hand.filter((it) => it == null).length === 7) {
					return this.emptyHandBonus
				} else {
					return -getHandValue(hand)
				}
			})
		},

		placedValidAndInvalidWords(): IValidAndInvalidWords | null {
			if (this.fieldIndex == null || !this.tile || this.tile.isOwned)
				return null
			const words = [
				getWordAt(this.board, this.fieldIndex, Direction.Horizontal).word,
				getWordAt(this.board, this.fieldIndex, Direction.Vertical).word,
			].filter((word) => word.length > 1)
			return {
				valid: words,
				invalid: [],
			}
		},

		winners(): IPlayer[] {
			if (this.mode !== Mode.Ended) return []
			let winningScore = -1
			let winners: IPlayer[] = []
			for (let player of this.players) {
				if (player.score > winningScore) {
					winningScore = player.score
					winners = [player]
				} else if (player.score === winningScore) {
					winners.push(player)
				}
			}
			return winners
		},

		isGameDrawn(): boolean {
			return this.players.length === this.winners.length
		},

		winnersNames(): string {
			if (this.winners.length === 0) return ``
			const winnerNames = this.winners.map((winner) => winner.name)
			const last = winnerNames[winnerNames.length - 1]
			const rest = winnerNames.slice(0, winnerNames.length - 1)
			return rest.length ? `${rest.join(', ')} és ${last}` : last
		},
	},
	actions: {
		collectTiles() {
			const tiles: ITile[] = []
			for (const field of this.board) {
				if (field.tile && field.tile.isOwned) {
					const tile = field.tile
					field.tile = null
					tiles.push(tile)
					if (tile.isJoker) tile.letter = ' '
				}
			}
			const hand = this.hands[this.playerIndex!]
			for (let i = 0; i < hand.length; i++) {
				if (hand[i] == null) {
					hand[i] = tiles.shift() || null
				}
			}
		},

		disownTiles() {
			for (const field of this.board) {
				if (field.tile) {
					if (field.tile.isOwned) {
						field.tile.isOwned = undefined
						field.tile.isLast = true
					} else if (field.tile.isLast) {
						field.tile.isLast = undefined
					}
				}
			}
		},

		fillHand() {
			const hand = this.hands[this.playerIndex!]
			const count = Math.min(
				this.bag.length,
				hand.length - getHandTileCount(hand),
			)
			const tiles: ITile[] = []
			for (let i = 0; i < count; i++) {
				const tile = this.bag.splice(
					Math.floor(Math.random() * this.bag.length),
					1,
				)[0]
				tile.isOwned = true
				tiles.push(tile)
			}
			const newHand = (this.hands[this.playerIndex!] = hand.map((tile) =>
				tile ? tile : tiles.shift() || null,
			))
			this.startingHandCount = getHandTileCount(newHand)
		},

		nextPlayer() {
			this.playerIndex = this.playerIndex == null ? 0 : this.playerIndex + 1
			if (this.playerIndex >= this.players.length) {
				this.playerIndex = 0
			}
			this.fieldIndex = null
			this.handIndex = null
		},

		score() {
			this.players[this.playerIndex!].score += this.moveScore
		},

		setJokerLetter(letter: string) {
			this.board[this.fieldIndex!].tile!.letter = letter
			this.fieldIndex = null
		},

		setMode(mode: Mode) {
			if (mode !== this.mode) {
				this.fieldIndex = null
				this.handIndex = null
			}
			this.mode = mode
		},

		swapHandAndBoard(fieldIndex: number, handIndex: number) {
			const tileOnBoard = this.board[fieldIndex].tile
			const tileInHand = this.hand![handIndex]
			this.fieldIndex = tileInHand && tileInHand.isJoker ? fieldIndex : null
			this.handIndex = null
			this.board[fieldIndex].tile = tileInHand
			this.hand![handIndex] = tileOnBoard
			if (tileOnBoard && tileOnBoard.isJoker) {
				tileOnBoard.letter = ' '
			}
		},

		swapHands(handIndexA: number, handIndexB: number) {
			const hand = this.hands[this.playerIndex!]
			const tileA = hand[handIndexA]
			const tileB = hand[handIndexB]
			this.handIndex = null
			hand[handIndexA] = tileB
			hand[handIndexB] = tileA
		},

		swapTiles(fieldIndexA: number, fieldIndexB: number) {
			const fieldATile = this.board[fieldIndexA].tile
			const fieldBTile = this.board[fieldIndexB].tile
			this.fieldIndex = null
			this.board[fieldIndexA].tile = fieldBTile
			this.board[fieldIndexB].tile = fieldATile
		},

		toggleHandIndexToReplace(handIndex: number) {
			this.handIndicesToReplace[handIndex] =
				!this.handIndicesToReplace[handIndex]
		},

		removeTilesToReplaceFromHand() {
			const hand = this.hands[this.playerIndex!]
			this.hands[this.playerIndex!] = hand.map((tile, index) =>
				this.handIndicesToReplace[index] ? null : tile,
			)
		},

		deselectTilesToReplace() {
			this.handIndicesToReplace.fill(false)
		},

		addTilesToBag(tiles: ITile[]) {
			this.bag.push(...tiles)
		},

		incrementSkipCount() {
			this.skipCount = (this.skipCount || 0) + 1
		},

		resetSkipCount() {
			this.skipCount = 0
		},

		scoreBonuses() {
			this.players.forEach((player, playerIndex) => {
				player.score += this.playerBonuses[playerIndex]
			})
		},

		loadGame() {
			const savedGame = getNoError<IState | undefined>(undefined, () =>
				JSON.parse(localStorage[LocalStorageKey.SavedGame]),
			)
			if (savedGame) {
				console.log(`Game loaded.`)
				this.$patch(savedGame)
			} else {
				console.log(`Game could not be loaded.`)
			}
		},

		saveGame() {
			try {
				localStorage[LocalStorageKey.SavedGame] = JSON.stringify(this.$state)
			} catch (e) {
				console.error(e)
			}
		},

		newGame() {
			const names = this.players.map((player) => player.name)
			this.$reset()
			names.forEach((name, playerIndex) => {
				this.players[playerIndex].name = name
			})
			this.players.forEach(() => {
				this.nextPlayer()
				this.fillHand()
			})
			this.mode = Mode.PlaceTile
			this.nextPlayer()
			this.saveGame()
		},

		selectHand(handIndexToSelect: number): void {
			if (this.mode === Mode.ReplaceTiles) {
				this.toggleHandIndexToReplace(handIndexToSelect)
			} else {
				const field =
					this.fieldIndex != null ? this.board[this.fieldIndex] : null
				const tile = field && field.tile
				if (field && tile && tile.isOwned) {
					this.swapHandAndBoard(this.fieldIndex!, handIndexToSelect)
				} else {
					if (this.handIndex === handIndexToSelect) {
						this.handIndex = null
					} else {
						if (this.handIndex == null) {
							this.handIndex = this.hands[this.playerIndex!][handIndexToSelect]
								? handIndexToSelect
								: null
						} else {
							this.swapHands(this.handIndex, handIndexToSelect)
						}
					}
				}
			}
		},

		skip() {
			this.incrementSkipCount()
			if ((this.skipCount || 0) >= this.players.length * 2) {
				this.endGame()
			} else {
				this.collectTiles()
				this.nextPlayer()
				this.saveGame()
			}
		},

		endGame() {
			this.scoreBonuses()
			this.setMode(Mode.Ended)
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
