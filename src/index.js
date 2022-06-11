const express = require('express')
const { v4: uuidV4 } = require('uuid')

const app = express()

app.use(express.json())
const customers = []

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers
  const customer = customers.find((customer) => customer.cpf === parseInt(cpf))
  if(!customer) {
    return response.status(400).json({ message: "Customer not found" })
  }
  /**
   *  meu request agora guarda o custumer
   */
  request.customer = customer
  return next()
}

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

app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request
  return response.status(200).json(customer.statement)
})


app.listen('3000')