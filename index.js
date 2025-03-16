const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('person', (req, res) => {
    if(req.method==='POST') return JSON.stringify(req.body)
    return ' '
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const info = `
    <p> Phonebook has info for ${persons.length} people </p>
    <br/>
    <p> ${new Date().toString()} </p>
    `
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    return response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        return response.json(person)
    }
    return response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    return response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const body = request.body

    if(!body.name){
      return response.status(400).json({
        error: 'name missing'
      })
    }

    if(persons.find(p => p.name === body.name)){
        return response.status(400).json({
          error: 'name already exists'
        })
      }
  
    const person = {
      name: body.name,
      number: body.number || '',
      id: Math.floor(Math.random() * 100000)
    }
  
    persons = persons.concat(persons)
  
    response.json(person)
})

PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    `Server is running on port ${PORT}`
})