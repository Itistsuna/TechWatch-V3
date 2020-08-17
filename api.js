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


// ROUTE DELETE STUDENTS PARAMS ------------------------------------------------------------------------------------------

app.delete('/students/:name', async (req, res) => {
    try {
        client.db('TechWatch-V3').collection('Students').deleteOne({name: req.body.name})
        res.send('Student delete')
    } catch (error) {
        console.log(error)
    }
})

// ROUTE DELETE STUDENTS ------------------------------------------------------------------------------------------

app.delete('/students', async (req,res)=> {
    try {
        const students = await client.db('TechWatch-V3').collection('Students').find().toArray()
        students.forEach((element)=>{
            console.log("Le nom " + element.name + "a bien été supprimé")
            client.db('TechWatch-V3').collection('Students').deleteOne(element)
        })
        res.send('Tout les noms ont bien été supprimé')
    } catch (error){
      console.log(error);  
    }
})

// ROUTE POST GROUPS ------------------------------------------------------------------------------------------


app.post('/groups', async(req,res)=>{
    try {
        class Groups {
            constructor(){
                this.subject = req.body.subject
                this.deadline = req.body.deadline
                this.student = req.body.student
            }
        }
        let nGroupe = new Groups
        client.db('TechWatch-V3').collection('Groups').insertOne({nGroupe})
        res.send('Le groupe a bien été enregistré')
    } catch (error) {
        console.log(error);
    }
})

// ROUTE GET GROUPS ------------------------------------------------------------------------------------------

app.get('/groups', async (req, res) => {

    try {
        const groups = await client.db('TechWatch-V3').collection('Groups').find().toArray()
        res.json(groups)

    } catch (error) {
        console.log(error)
    }
})















app.listen(8080, function () {
    console.log('listening on http://localhost:8080/students');
});