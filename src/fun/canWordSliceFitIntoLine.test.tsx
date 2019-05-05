import { withInterface } from 'illa/Type'
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

it(`works`, () => {
	expect(
		canWordSliceFitIntoLine(
			{ startMissing: true, wordParts: ['a', 'b'] },
			[5, 'b', 5],
			[makeTile('x'), makeTile('a')],
		),
	).toBe(true)
})
