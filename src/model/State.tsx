import { IField } from './Field'
import { Mode } from './Mode'
import { IPlayer } from './Player'
import { ITile } from './Tile'

export interface IState {
	readonly mode: Mode
	readonly players: ReadonlyArray<IPlayer>
	readonly playerIndex: number | null
	readonly board: ReadonlyArray<IField>
	readonly bag: ReadonlyArray<ITile>
	readonly fieldIndex: number | null
	readonly handIndex: number | null
	readonly hands: ReadonlyArray<ReadonlyArray<ITile | null>>
	readonly handIndicesToReplace: ReadonlyArray<boolean>
}
