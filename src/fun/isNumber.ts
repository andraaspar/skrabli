export function isNumber(o: unknown): o is number {
	return typeof o === 'number'
}
