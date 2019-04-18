import { withInterface } from 'illa/Type'
import { IField } from './Field'
import { FieldKind } from './FieldKind'

export type TBoard = ReadonlyArray<IField>

export function createBoard(): TBoard {
	return `
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
		)
}
