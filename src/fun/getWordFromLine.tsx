import { BOARD_SIZE } from '../model/Constants'
import { IField } from '../model/Field'

export function getWordFromLine(
	line: ReadonlyArray<IField>,
	lineIndex: number,
) {
	const word: IField[] = []
	let index = lineIndex
	let startLineIndex = lineIndex
	let endLineIndex = lineIndex
	while (index >= 0) {
		const field = line[index]
		if (!field.tile) break
		word.unshift(field)
		startLineIndex = index
		index--
	}
	index = lineIndex + 1
	while (index < BOARD_SIZE) {
		const field = line[index]
		if (!field || !field.tile) break
		word.push(field)
		endLineIndex = index
		index++
	}
	return {
		word: word.length > 1 ? word : [],
		startLineIndex,
		endLineIndex,
	}
}
