import { FieldKind } from '../model/FieldKind'
import { type IField } from '../model/IField'

export function getWordScore(word: ReadonlyArray<IField>): number {
	let wordMulti = 1
	return (
		word.reduce((sum, field) => {
			const tile = field.tile
			let tileScore = 0
			if (tile) {
				tileScore = tile.score
				if (tile.isOwned) {
					switch (field.kind) {
						case FieldKind.DoubleLetter:
							tileScore *= 2
							break
						case FieldKind.TripleLetter:
							tileScore *= 3
							break
						case FieldKind.Start:
						case FieldKind.DoubleWord:
							wordMulti *= 2
							break
						case FieldKind.TripleWord:
							wordMulti *= 3
							break
						default:
					}
				}
			}
			return sum + tileScore
		}, 0) * wordMulti
	)
}
