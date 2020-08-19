const express = require('express');
const app = express();
const fetch = require('node-fetch');
const alert = require('alert');

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

async function date() {
	let group = await readingGroups();
	group.forEach((element) => {
		element.nGroupe.deadline = new Date(element.nGroupe.deadline)
	});
	group.sort((a, b) => b.nGroupe.deadline - a.nGroupe.deadline);
	group.forEach((element) => {
		year = element.nGroupe.deadline.getFullYear();
		month = element.nGroupe.deadline.getMonth() + 1;
		dt = element.nGroupe.deadline.getDate();
		if (dt < 10) {
			dt = '0' + dt;
		}
		if (month < 10) {
			month = '0' + month;
		}
		element.nGroupe.deadline = (year + '-' + month + '-' + dt);
	});
	return group;
}
date();

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
		body: JSON.stringify({ name: req.body.name })
	});
	res.redirect('http://localhost:3000/students');
});

// REQUETE DELETE STUDENT  ------------------------------------------------------------------------------

app.post('/students/delete', async (req, res) => {
	await fetch(`http://localhost:8080/Students/${req.body.name}`, {
		method: 'delete'
	});
	res.redirect('http://localhost:3000/students');
});

// REQUETE GET GROUP  ------------------------------------------------------------------------------

app.get('/groups', async function(req, res) {
	let groups = await date()
	let tabG = [];
	for (let i = 0; i < groups.length; i++) {
		tabG.push(groups[i]);
	}
	res.render('groups.ejs', { groups: tabG });
});

// REQUETE POST GROUP ------------------------------------------------------------------------------
app.post('/groups', async function(req, res) {
	if (req.body.subject != '') {
		if (req.body.student != '') {
			if (req.body.deadline != '') {
				let students = await reading();
				let name = [];
				var index = students.length;
				for (let i = 0; i < req.body.student; i++) {
					random = Math.floor(Math.random() * index);
					name1 = students[random];
					name.push(name1);
					students.splice(random, 1);
					index = students.length;
				}
				class Groups {
					constructor() {
						this.subject = req.body.subject;
						this.deadline = req.body.deadline;
						this.student = name;
					}
				}
				let nGroupe = new Groups();
				await fetch('http://localhost:8080/groups', {
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(nGroupe)
				});
				res.redirect('http://localhost:3000/groups');
			} else {
				alert('Deadline manquante');
			}
		} else {
			alert("Nombres d'étudiants manquants");
		}
	} else {
		alert('Sujet manquant');
	}
});
// GET HISTORIQUE  ------------------------------------------------------------------------------

app.get('/historique', async function(req, res) {
	let groups = await date();
	let tabG = [];
	for (let i = 0; i < groups.length; i++) {
		tabG.push(groups[i]);
	}
	res.render('historique.ejs', { groups: tabG });
});

// GET HOME  ------------------------------------------------------------------------------

app.get('/', async function(req, res) {
	let groups = await date();
	let tabG = [];
	for (let i = 0; i < groups.length; i++) {
		tabG.push(groups[i]);
	}
	res.render('home.ejs', { groups: tabG });
});

// INITIALISATION SERVER ------------------------------------------------------------------------------

app.listen(3000, function() {
	console.log('server on at http://localhost:3000');
});
