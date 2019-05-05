import { getWordSlices } from './getWordSlices'

it(`works`, () => {
	expect(getWordSlices('papppa', [/./], [/(p)(.)(p)/g])).toEqual([
		{ startMissing: false, wordParts: ['p', 'a', 'p', 'ppa'] },
		{ startMissing: true, wordParts: ['pa', 'p', 'p', 'p', 'a'] },
	])
})
