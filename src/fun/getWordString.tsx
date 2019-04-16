import { IField } from '../model/Field'
export function getWordString(word: ReadonlyArray<IField>): string {
	return word.map(_ => _.tile!.letter).join('')
}
