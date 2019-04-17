import words from '../res/words.json'

export function isWordStringValid(w: string): boolean {
	return words.indexOf(w) >= 0
}
