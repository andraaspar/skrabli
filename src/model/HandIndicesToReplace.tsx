import { range } from 'illa/ArrayUtil'

export type THandIndicesToReplace = ReadonlyArray<boolean>

export function createHandIndicesToReplace(): THandIndicesToReplace {
	return range(7).map(_ => false)
}
