import { withInterface } from 'illa/Type'
import { IField } from '../model/Field'
import { FieldKind } from '../model/FieldKind'
import { ITile } from '../model/Tile'
import { getPotentialWordsInLine } from './getPotentialWordsInLine'

it(`[prckst]`, () => {
	expect(
		getPotentialWordsInLine(
			[makeField('t'), makeField(null)],
			[makeTile('e')],
		),
	).toEqual(['te'])
})
it(`[prcm7b]`, () => {
	expect(
		getPotentialWordsInLine(
			[makeField(null), makeField('t'), makeField(null)],
			[makeTile('e')],
		),
	).toEqual(['te'])
})
it(`[prcm7i]`, () => {
	expect(
		getPotentialWordsInLine(
			[makeField(null), makeField(null), makeField('t')],
			[makeTile('e'), makeTile('s')],
		),
	).toEqual(['est'])
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
