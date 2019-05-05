import { partsToRegExpString } from './partsToRegExpString'

it(`works`, () => {
	expect(partsToRegExpString('.', [1, 'a', 2, 'b', 3])).toBe(
		`^(.{0,1})(a)(.{2})(b)(.{0,3})$`,
	)
})
