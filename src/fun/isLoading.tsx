import { TLoadable } from '../model/TLoadable'

export function isLoading<T>(l: TLoadable<T>): l is number {
	return typeof l === 'number'
}
