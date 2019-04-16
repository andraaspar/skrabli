import { range } from 'illa/ArrayUtil'
import { withInterface } from 'illa/Type'
import { IField } from '../model/Field'
import { FieldKind } from '../model/FieldKind'
import { Mode } from '../model/Mode'
import { IPlayer } from '../model/Player'
import { IState } from '../model/State'
import { ITile } from '../model/Tile'
import letters from '../res/letters.json'

export function createState(): IState {
	return {
		mode: Mode.NotStarted,
		board: `
W--l---W---l--W
-w---L---L---w-
--w---l-l---w--
l--w---l---w--l
----w-----w----
-L---L---L---L-
--l---l-l---l--
W--l---s---l--W
--l---l-l---l--
-L---L---L---L-
----w-----w----
l--w---l---w--l
--w---l-l---w--
-w---L---L---w-
W--l---W---l--W
`
			.trim()
			.split(/\n/)
			.flatMap(row =>
				row.split('').map(letter =>
					withInterface<IField>({
						kind: letter as FieldKind,
						tile: null,
					}),
				),
			),
		bag: letters.flatMap(({ count, letter, score }) =>
			range(count).map(_ =>
				withInterface<ITile>({
					letter,
					score,
					isOwned: false,
					isJoker: letter === ' ',
				}),
			),
		),
		hands: range(2).map(_ => range(7).map(_ => null)),
		players: range(2).map(_ =>
			withInterface<IPlayer>({
				name: `${_ + 1}. Játékos`,
				score: 0,
			}),
		),
		playerIndex: null,
		fieldIndex: null,
		handIndex: null,
		handIndicesToReplace: range(7).map(_ => false),
	}
}
