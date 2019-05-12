const express = require('express')
const app = express()
const path = require('path')
const port = 5000
var cors = require('cors')
express.static.mime.types['wasm'] = 'application/wasm'

app.use(cors())
app.use('/static', express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Static file server listening on port ${port}!`))

