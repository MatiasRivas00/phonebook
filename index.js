require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const person = require('./models/person')

morgan.token('person', (req, res) => {
  if(req.method==='POST') return JSON.stringify(req.body)
  return ' '
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }

  else if(error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const info = `
      <p> Phonebook has info for ${persons.length} people </p>
      <br/>
      <p> ${new Date().toString()} </p>
    `
    response.send(info)
  })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number || '',
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body
  const config = { new: true, runValidators: true, content: 'query' }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, config)
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  `Server is running on port ${PORT}`
})