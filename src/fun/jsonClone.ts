export function jsonClone<T>(o: T): T {
	return JSON.parse(JSON.stringify(o))
}
