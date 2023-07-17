export function getNoError<T>(fallback: T, fn: () => T): T {
	try {
		return fn()
	} catch (e) {
		// Ignore error
	}
	return fallback
}
