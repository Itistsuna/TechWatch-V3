const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://127.0.0.1:27017', {
    useUnifiedTopology: true
});
const express = require('express')
const app = express()
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

async function bdd() {

    try {
        await client.connect()

    } catch (error) {
        console.log(error)
    }
}

bdd()

// ROUTE POST STUDENTS ------------------------------------------------------------------------------------------

app.post('/students', async (req, res) => {

    try {
        await client.db('TechWatch-V3').collection('Students').insertOne({
            name: req.body.name
        })
        res.json({
            "msg": "recue"
        })

    } catch (error) {
        console.log(error)
    }
})

// ROUTE GET STUDENTS ------------------------------------------------------------------------------------------

app.get('/students', async (req, res) => {

    try {
        const students = await client.db('TechWatch-V3').collection('Students').find().toArray()
        res.json(students)

    } catch (error) {
        console.log(error)
    }
})


// ROUTE DELETE STUDENTS ------------------------------------------------------------------------------------------

app.delete('/students', async (req, res) => {
    try {
        client.db('TechWatch-V3').collection('Students').deleteOne({name: req.body.name})
        res.send('Student delete')

    } catch (error) {
        console.log(error)
    }
})




















app.listen(8080, function () {
    console.log('listening on http://localhost:8080/students');
});