var KNOWN_WORDS = []

document
	.querySelector('.list-group.mb-3')
	.innerText.split(/[\n\r]+/)
	.map((w) => w.trim().replace(/\s*\[.*?\]\s*/, ''))
	.filter((w) => !KNOWN_WORDS.includes(w))
	.map((w) => w + '-' + w.length)
