const express = require('express')

const app = express()

app.get('/', (request, response) => {
  return response.json({ message: 'Hello Guys' })
})

app.listen('3002')