import { FieldKind } from './FieldKind'
import { ITile } from './Tile'

export interface IField {
	readonly kind: FieldKind
	readonly tile: ITile | null
}
