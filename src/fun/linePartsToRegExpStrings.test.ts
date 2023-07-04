import { expect, it } from 'vitest'
import { linePartsToRegExpStrings } from './linePartsToRegExpStrings'

it(`[prcnuu]`, () => {
	expect(
		linePartsToRegExpStrings('.', [
			1,
			{ text: 'a', fieldCount: 1 },
			2,
			{ text: 'b', fieldCount: 1 },
			3,
		]),
	).toEqual([
		`^(.{0,1})(a)(.{0,1})$`,
		`^(.{0,1})(a)(.{2})(b)(.{0,3})$`,
		`^(.{0,1})(b)(.{0,3})$`,
	])
})
it(`[prcnv0]`, () => {
	expect(
		linePartsToRegExpStrings('(?:e|s)', [2, { text: 't', fieldCount: 1 }, 0]),
	).toEqual([`^((?:e|s){0,2})(t)$`])
})
