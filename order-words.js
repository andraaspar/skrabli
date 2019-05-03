const fs = require('fs')
const path = require('path')

main()

async function main() {
	const fn = process.argv[2]
	const list = await readJson(fn)
	list.sort((a, b) => {
		if (a.length === b.length) {
			return a.localeCompare(b, 'hu')
		} else {
			return a.length - b.length
		}
	})
	fs.writeFileSync(path.resolve(fn), JSON.stringify(list, undefined, '\t'), {
		encoding: 'utf8',
	})
}

function readJson(fn) {
	return new Promise((resolve, reject) => {
		fs.readFile(path.resolve(fn), { encoding: 'utf8' }, (e, data) => {
			try {
				if (e) throw e
				else resolve(JSON.parse(data))
			} catch (e) {
				reject(e)
			}
		})
	})
}
