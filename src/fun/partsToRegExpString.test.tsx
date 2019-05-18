import { partsToRegExpString } from './partsToRegExpString'

it(`works`, () => {
	expect(
		partsToRegExpString('.', [
			1,
			{ text: 'a', fieldCount: 1 },
			2,
			{ text: 'b', fieldCount: 1 },
			3,
		]),
	).toBe(`^(.{0,1})(a)(.{2})(b)(.{0,3})$`)
})
