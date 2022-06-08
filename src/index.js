const express = require('express')
const { v4: uuidV4 } = require('uuid')

const app = express()

app.use(express.json())
const customers = []

app.post('/account', (request, response) => {
  const { cpf, name } = request.body
  const customerAlreadyExists = customers.some((customer) => customer.cpf === parseInt(cpf))
  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists!' })
  }
  customers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: []
  })
  return response.status(201).json(customers)
})

app.get('/statement/:cpf', (request, response) => {
  const { cpf } = request.params
  const customer = customers.find((customer) => customer.cpf === parseInt(cpf))
  return response.status(200).json(customer.statement)
})

app.listen('3002')