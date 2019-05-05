import { withInterface } from 'illa/Type'
import { ITile } from '../model/Tile'
import { getHandIndicesForWord } from './getHandIndicesForWord'

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
		getHandIndicesForWord('abc', [makeTile('a'), makeTile('bc')]),
	).toEqual([0, 1])
	expect(
		getHandIndicesForWord('abc', [makeTile('bc'), makeTile('a')]),
	).toEqual([1, 0])
	expect(
		getHandIndicesForWord('abc', [
			makeTile('a'),
			makeTile('x'),
			makeTile('bc'),
		]),
	).toEqual([0, 2])
	expect(
		getHandIndicesForWord('abc', [makeTile('a'), null, makeTile('bc')]),
	).toEqual([0, 2])
})
