import { FieldKind } from '../../model/FieldKind'
import { IField } from '../../model/IField'
import { withInterface } from '../withInterface'
import { makeTile } from './makeTile'

export function makeField(letter: string | null, kind = FieldKind.Normal) {
	return withInterface<IField>({
		kind: kind,
		tile: letter ? makeTile(letter) : null,
	})
}
