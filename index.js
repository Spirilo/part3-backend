const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', req => { 
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-1234567'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5325235'
    },
    {
        id: 3,
        name: 'Dan Abromov',
        number: '12-3342-2425454'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-323-3323232'
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    let person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    let count = persons.length
    let now = new Date()
    res.send(`
        <p>Phonebook has info for ${count} people.</p>
        <p>${now.toString()}</p>`)
})

app.post('/api/persons', (req, res) => {
    let body = req.body
    let id = Math.floor(Math.random() * 1000)
    let isOnTheList = persons.find(p => p.name === body.name)

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number missing!'
        })
    }
    if (isOnTheList) {
        return res.status(400).json({
            error: 'Name is already on the list!'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})