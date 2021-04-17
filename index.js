require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))

logger.token('post-data', function(request, response) {
  return JSON.stringify(request.body)
})


app.use(logger(':method :url :status :res[content-length] - :response-time ms :post-data '))


app.get('/', (request, response) => {
  response.send('<h3>Hello world</h3>')
})


app.get('/info', (request, response) => {
  Person
    .count({})
    .then(number => {
      const time = new Date().toString()
      response.send(`<p>Phonebook has info for ${number} people</p><p>${time}</p>`)
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(people => {
      response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(returnedPerson => {
      if (returnedPerson) {
        response.json(returnedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(deleted => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })

  newPerson
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const newPerson = {
    name: request.body.name,
    number: request.body.number
  }

  Person
    .findByIdAndUpdate(
      request.params.id,
      newPerson,
      {
        new: true,
        runValidators: true,
        context: 'query'
      })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`starting app on port ${PORT}`)
})