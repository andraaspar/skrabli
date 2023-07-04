import { FieldKind } from './FieldKind'
import { type ITile } from './ITile'

export interface IField {
	kind: FieldKind
	tile: ITile | null
}
