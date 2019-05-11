import { linePartsToRegExpStrings } from './linePartsToRegExpStrings'

it(`[prcnuu]`, () => {
	expect(linePartsToRegExpStrings('.', [1, 'a', 2, 'b', 3])).toEqual([
		`^(.{0,1})(a)(.{0,1})$`,
		`^(.{0,1})(a)(.{2})(b)(.{0,3})$`,
		`^(.{0,1})(b)(.{0,3})$`,
	])
})
it(`[prcnv0]`, () => {
	expect(linePartsToRegExpStrings('(?:e|s)', [2, 't', 0])).toEqual([
		`^((?:e|s){0,2})(t)$`,
	])
})
