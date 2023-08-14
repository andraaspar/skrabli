import { LETTERS } from './LETTERS'

export const JOKER_LETTERS = LETTERS.filter((letter) => letter.letter !== ' ')
	.map((letter) => letter.letter)
	.sort((a, b) => b.length - a.length)
