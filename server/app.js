const express = require('express')
require('dotenv').config()

const app = express();


app.use('/api/auth', require('./routes/auth.routes'))

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Start Server to PORT = ${PORT}...`))
