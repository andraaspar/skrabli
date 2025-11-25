import { readFile, writeFile } from 'node:fs/promises'

const wordsText = await readFile('src/words.txt', { encoding: 'utf8' })

const words = Array.from(new Set(wordsText.split('\n'))).sort((a, b) =>
	a.localeCompare(b, 'hu'),
)

await writeFile('src/words.txt', words.join('\n'))

console.log(`${words.length.toLocaleString('hu')} szó sorba rendezve.`)
