import { writeFileSync } from 'fs'
import { KNOWN_WORDS } from './src/model/KNOWN_WORDS'

KNOWN_WORDS.sort((a, b) => a.localeCompare(b, 'hu'))

writeFileSync(
	'./src/model/KNOWN_WORDS.ts',
	[
		'export const KNOWN_WORDS = [',
		...KNOWN_WORDS.map((word) => "\t'" + word + "',"),
		']\n',
	].join('\n'),
)
