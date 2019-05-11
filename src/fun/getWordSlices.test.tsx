import { withInterface } from 'illa/Type'
import { IWordSlice } from '../model/IWordSlice'
import { getWordSlices } from './getWordSlices'

it(`[prcldm]`, () => {
	expect(
		getWordSlices(
			'papppa',
			[/^((?:p|a){0,2})(p)((?:p|a){1})(p)((?:p|a){0,3})$/],
			[/(p)((?:p|a){1})(p)/g],
		),
	).toEqual([
		withInterface<IWordSlice>({
			firstIsFixed: true,
			wordParts: ['p', 'a', 'p', 'ppa'],
		}),
		withInterface<IWordSlice>({
			firstIsFixed: false,
			wordParts: ['pa', 'p', 'p', 'p', 'a'],
		}),
	])
})
it(`[prcldm]`, () => {
	expect(
		getWordSlices('te', [/^((?:e){0,1})(t)((?:e){0,1})$/], [/(t)/g]),
	).toEqual([
		withInterface<IWordSlice>({
			firstIsFixed: true,
			wordParts: ['t', 'e'],
		}),
	])
})
it(`[prcmdj]`, () => {
	expect(getWordSlices('est', [/^((?:e|s){0,2})(t)$/g], [/(t)/g])).toEqual([
		withInterface<IWordSlice>({
			firstIsFixed: false,
			wordParts: ['es', 't'],
		}),
	])
})
