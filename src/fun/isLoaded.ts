import { TLoadable } from '../model/TLoadable'

export function isLoaded<T>(l: TLoadable<T>): l is { loaded: T } {
	return typeof l === 'object' && l != null
}
