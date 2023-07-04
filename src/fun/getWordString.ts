import { type IField } from '../model/IField'

export function getWordString(word: ReadonlyArray<IField>): string {
	return word.map((_) => _.tile!.letter).join('')
}
