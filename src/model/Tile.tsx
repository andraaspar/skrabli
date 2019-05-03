export interface ITile {
	readonly letter: string
	readonly score: number
	readonly isOwned: boolean | undefined
	readonly isJoker: boolean | undefined
	readonly isLast: boolean | undefined
}
