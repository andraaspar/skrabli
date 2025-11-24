import { type IField } from '../model/IField'

export function getWordFromLine(
	line: ReadonlyArray<IField>,
	lineIndex: number,
) {
	const word: IField[] = []
	let index = lineIndex
	let startLineIndex = lineIndex
	let endLineIndex = lineIndex
	while (index >= 0) {
		const field = line[index]!
		if (!field.tile) break
		word.unshift(field)
		startLineIndex = index
		index--
	}
	index = lineIndex + 1
	while (index < line.length) {
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
