const express = require('express')
const compression = require('compression')

const app = express()
app.use(compression())
app.use('/skrabli', express.static('build'))
app.listen(8080, () => {
	console.log(`Listening on 8080...`)
})
