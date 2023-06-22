import { TLoadable } from '../model/TLoadable'

export function hasError<T>(l: TLoadable<T>): l is string {
	return typeof l === 'string'
}
