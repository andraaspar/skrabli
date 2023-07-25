export function listed(arr: string[]): string {
	if (arr.length === 0) return ''
	if (arr.length === 1) return arr[0]
	const last = arr.at(-1)
	const rest = arr.slice(0, -1)
	return rest.join(', ') + ' és ' + last
}
