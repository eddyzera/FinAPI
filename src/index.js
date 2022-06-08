const express = require('express')
const { v4: uuidV4 } = require('uuid')

const app = express()

const customers = []

app.use(express.json())

app.post('/account', (request, response) => {
  const { cpf, name } = request.body
  const id = uuidV4()
  customers.push({
    cpf,
    name,
    id,
    statement: []
  })

  return response.status(201).json(customers)
})

app.listen('3002')