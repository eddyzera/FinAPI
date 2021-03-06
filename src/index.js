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

/**
 * Helpers
 */
function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if(operation.type === 'credit') {
      return acc + operation.amount
    } else {
      return acc - operation.amount
    }
  }, 0)

  return balance
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

app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body
  const { customer } = request
  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body
  const { customer } = request

  const balance = getBalance(customer.statement)

  if(balance < amount) {
    return response.status(400).json({ message: 'Insufficient funds' })
  }

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

app.get('/statement/date', (request, response) => {
  const { customer } = request
  const { date } = request.query
  const dateFormat = new Date(date + " 00:00")
  const statement = 
    customer.filter((statement) => 
      statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    )
  return response.json(statement)
})

app.put('/account', (request, response) => {
  const { name } = request.body
  const { customer } = request
  customer.name = name

  return response.status(201).send()
})

app.get('/account', (request, response) => {
  const { customer } = request
  return response.json(customer)
})

app.delete('account', (request, response) => {
  const { customer } = request
  customer.splice(customer, 1)
  return response.status(204)
})

app.listen('3000')