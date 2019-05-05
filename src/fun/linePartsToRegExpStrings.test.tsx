import { linePartsToRegExpStrings } from './linePartsToRegExpStrings'

it(`works`, () => {
	expect(linePartsToRegExpStrings('.', [1, 'a', 2, 'b', 3])).toEqual([
		`^(.{0,1})(a)(.{0,1})$`,
		`^(.{0,1})(a)(.{2})(b)(.{0,3})$`,
		`^(.{0,1})(b)(.{0,3})$`,
	])
})
