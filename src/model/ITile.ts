export interface ITile {
	letter: string
	score: number
	isOwned: boolean | undefined
	isJoker: boolean | undefined
	isLast: boolean | undefined
}
