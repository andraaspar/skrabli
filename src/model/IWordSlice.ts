import type { IWordPart } from './IWordPart'

export interface IWordSlice {
	word: string
	fieldOffset: number
	wordParts: IWordPart[]
}
