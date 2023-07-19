import { writeFileSync } from 'fs'
import { KNOWN_WORDS } from '../src/model/KNOWN_WORDS'

const words = Array.from(new Set(KNOWN_WORDS)).sort((a, b) =>
	a.localeCompare(b, 'hu'),
)

writeFileSync(
	'./src/model/KNOWN_WORDS.ts',
	[
		'export const KNOWN_WORDS = [',
		...words.map((word) => "\t'" + word + "',"),
		']\n',
	].join('\n'),
)
