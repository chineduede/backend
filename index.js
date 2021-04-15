const express = require('express');
const logger = require('morgan');
const app = express();

app.use(express.json());
app.use(express.static('build'));

logger.token('post-data', function(request, response) {
    return JSON.stringify(request.body)
})


app.use(logger(":method :url :status :res[content-length] - :response-time ms :post-data "))

let people = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]



app.get('/', (request, response) => {
    response.send('<h3>Hello world</h3>')
})


app.get('/info', (request, response) => {
    const message = `Phonebook has info for ${people.length} people`;
    const time = new Date().toString();
    response.send(
        `<p>${message}</p><p>${time}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(people)
})

app.get('/api/persons/:id', (request, response) => {
    const person = people.find(person => person.id === Number(request.params.id));
    if (!person) {
        return response.status(400).json({
            "error": `user with ${request.params.id} id not found`
        })
    }
        
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const person = people.find(person => person.id === Number(request.params.id));
    if (!person) {
        return response.status(400).json({
            error: `user with ${request.params.id} id not found`
        })
    }
    
    people = people.filter(person => person.id !== Number(request.params.id))

    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const createPerson = request.body; 
    if (!createPerson.name) {
        return response.status(400).json({
            error: "a name must be given"
        })
    } else if (!createPerson.number) {
        return response.status(400).json({
            error: "a number must be given"
        })
    }
    let temp = people.map(person => person.name.toLowerCase());

    if (temp.includes(createPerson.name.toLowerCase())) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    const newPerson = {
        name: createPerson.name,
        number: createPerson.number,
        id: (Math.floor(Math.random() * 2000))
    };

    people = people.concat(newPerson)

    response.json(newPerson);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`starting app on port ${PORT}`);
});