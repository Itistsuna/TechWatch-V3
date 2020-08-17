const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// FUNCTION FETCH  ------------------------------------------------------------------------------

async function reading() {
	let read = await fetch('http://localhost:8080/Students');
	let respons = await read.json();
	return respons;
}

async function readingGroups() {
	let read = await fetch('http://localhost:8080/Groups');
	let respons = await read.json();
	return respons;
}

// REQUETE GET STUDENT ------------------------------------------------------------------------------

app.get('/students', async function(req, res) {
	let students = await reading();
	let tab = [];
	for (let i = 0; i < students.length; i++) {
		tab.push(students[i].name);
	}
	res.render('students.ejs', { students: tab });
});

// REQUETE POST STUDENT ------------------------------------------------------------------------------

app.post('/students', async (req, res) => {
	fetch('http://localhost:8080/Students', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({name : req.body.name})
    });
	res.redirect('http://localhost:3000/students');
});

// REQUETE DELETE STUDENT  ------------------------------------------------------------------------------

app.post('/students/delete', async (req, res) => {
    fetch('http://localhost:8080/Students/:name'),{
        method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
        body: JSON.stringify({name : req.body.name})
    }
    res.redirect('http://localhost:3000/students');
})

// REQUETE GET GROUP  ------------------------------------------------------------------------------

app.get('/groups', async function(req, res) {
	let groups = await readingGroups();
	let tabG = [];
	for (let i = 0; i < groups.length; i++) {
		tabG.push(groups[i]);
	}

	res.render('groups.ejs', { groups: tabG });
});

// REQUETE POST GROUP ------------------------------------------------------------------------------

// app.post()

// INITIALISATION SERVER ------------------------------------------------------------------------------

app.listen(3000, function() {
	console.log('server connected');
});
