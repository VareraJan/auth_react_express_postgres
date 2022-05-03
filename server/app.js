const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express();

app.use(cors());
app.use(express.json({ extended: true }))


app.use('/api/auth', require('./routes/auth.routes'))

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Start Server to PORT = ${PORT}...`))
