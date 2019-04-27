export function numberToSignedString(n: number) {
	if (n >= 0) return `+${n}`
	else return n + ''
}
