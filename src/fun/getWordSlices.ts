import { type IWordSlice } from '../model/IWordSlice'

export function getWordSlices(
	word: string,
	res: ReadonlyArray<RegExp>,
	resTrimmed: ReadonlyArray<RegExp>,
): IWordSlice[] {
	const result: IWordSlice[] = []
	res.forEach((re, index) => {
		if (re.test(word)) {
			const reTrimmed = resTrimmed[index]
			for (let i = 0; i < word.length; ) {
				reTrimmed.lastIndex = i
				const r = reTrimmed.exec(word)
				if (!r) break
				const matchStartIndex = r.index
				const matchEndIndex = reTrimmed.lastIndex
				const firstIsFixed = matchStartIndex === 0
				const wordParts = r.slice(1, r.length).filter(Boolean)
				if (matchStartIndex > 0) {
					wordParts.unshift(word.slice(0, matchStartIndex))
				}
				if (matchEndIndex < word.length) {
					wordParts.push(word.slice(matchEndIndex))
				}
				result.push({ firstIsFixed, wordParts })
				i = matchStartIndex + 1
			}
		}
	})
	return result
}
