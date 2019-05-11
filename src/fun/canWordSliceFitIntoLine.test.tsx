import { withInterface } from 'illa/Type'
import { IFixedLinePart } from '../model/IFixedLinePart'
import { ITile } from '../model/Tile'
import { canWordSliceFitIntoLine } from './canWordSliceFitIntoLine'

function makeTile(letter: string) {
	return withInterface<ITile>({
		letter,
		score: 1,
		isOwned: undefined,
		isJoker: undefined,
		isLast: undefined,
	})
}

function makeIFixedLinePart(text: string): IFixedLinePart {
	return {
		text,
		fieldCount: text.length,
	}
}

it(`[prcsfh]`, () => {
	expect(
		canWordSliceFitIntoLine(
			{ firstIsFixed: false, wordParts: ['a', 'b'] },
			[5, makeIFixedLinePart('b'), 5],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(true)
})
