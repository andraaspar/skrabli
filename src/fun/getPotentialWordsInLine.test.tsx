import { range } from 'illa/ArrayUtil'
import { withInterface } from 'illa/Type'
import { Direction } from '../model/Direction'
import { IField } from '../model/Field'
import { FieldKind } from '../model/FieldKind'
import { ITile } from '../model/Tile'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'

it(`[prckst]`, () => {
	expect(
		getPotentialWordsInLine(
			[makeField('t'), makeField(null)],
			0,
			Direction.Horizontal,
			[makeTile('e')],
		),
	).toEqual(['te'])
})
it(`[prcm7b]`, () => {
	expect(
		getPotentialWordsInLine(
			[makeField(null), makeField('t'), makeField(null)],
			0,
			Direction.Horizontal,
			[makeTile('e')],
		),
	).toEqual(['te'])
})
it(`[prcm7i]`, () => {
	expect(
		getPotentialWordsInLine(
			[makeField(null), makeField(null), makeField('t')],
			0,
			Direction.Horizontal,
			[makeTile('e'), makeTile('s')],
		),
	).toEqual(['est'])
})
it(`[preckt]`, () => {
	expect(
		getPotentialWordsInLine(
			[
				...range(7).map(() => makeField(null)),
				makeField('l'),
				...range(7).map(() => makeField(null)),
			],
			0,
			Direction.Horizontal,
			[makeTile('e')],
		),
	).toEqual(['el', 'le'])
})

function makeField(letter: string | null) {
	return withInterface<IField>({
		kind: FieldKind.Normal,
		tile: letter ? makeTile(letter) : null,
	})
}

function makeTile(letter: string) {
	return withInterface<ITile>({
		letter,
		score: 1,
		isOwned: undefined,
		isJoker: undefined,
		isLast: undefined,
	})
}
