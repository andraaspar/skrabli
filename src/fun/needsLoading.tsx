import { TLoadable } from '../model/TLoadable'

export function needsLoading<T>(l: TLoadable<T>): l is null | undefined {
	return l == null
}
