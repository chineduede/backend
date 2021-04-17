const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} 
  
const password = process.argv[2]

const url = `mongodb+srv://chndvz:${password}@cluster0.9aru7.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];
if (name === undefined || number === undefined) {
    returnAll();
} else {
    const newPerson = new Person({
        name,
        number
    })

    newPerson
        .save()
        .then(person => {
            console.log(person);
            mongoose.connection.close()
        })

    }



function returnAll () {
    Person
        .find({})
        .then(persons => {
            console.log('phonebook: ');
            persons.forEach(person => {
                console.log(person.name, person.number);
            })
            mongoose.connection.close()
        })
}

// console.log(mongoose.models)