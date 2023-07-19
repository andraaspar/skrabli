export function log<T>(label: string, o: T): T {
	console.log(label, o)
	return o
}
