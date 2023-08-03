export interface ITile {
	letter: string
	score: number
	isOwned: boolean | null
	isJoker: boolean | null
	isLast: boolean | null
}
