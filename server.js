const express = require('express');
const app = express();
const fetch = require('node-fetch');
const alert = require('alert');
let etudiantPris = []

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/style'));
// FUNCTION FETCH  ------------------------------------------------------------------------------

// Function qui permet de recupérer la collection Students
async function reading() {
	let read = await fetch('http://localhost:8080/Students');
	let respons = await read.json();
	return respons;
}

// Function qui permet de recupérer la collection Groups
async function readingGroups() {
	let read = await fetch('http://localhost:8080/Groups');
	let respons = await read.json();
	return respons;
}

// Function qui permet de transformer les dates en format "string" en format "Date"
async function date() {
	let group = await readingGroups();
	group.forEach((element) => {
		element.nGroupe.deadline = new Date(element.nGroupe.deadline)
	});
	group.sort((a, b) => b.nGroupe.deadline - a.nGroupe.deadline);
	return group;
}

// Function qui permet de trier les students pour ne pas qu'ils soient choisies deux fois
async function etudiantTrié() {
	etudiantPris = []
	let etudiants = await reading()
	let groupe = await readingGroups()
	for (i = 0; i < etudiants.length; i++) {
		for (let index = 0; index < groupe.length; index++) {
			for (let nIndex = 0; nIndex < groupe[index].nGroupe.student.length; nIndex++) {
				if (etudiants.length == 0) {
					console.log("Il n'y a plus d'étudiant");
				} else if (etudiants[i].name == groupe[index].nGroupe.student[nIndex].name) {
					etudiantPris.push(etudiants[i])
					etudiants.splice(i, 1);
					i = 0;
					index = 0;
					nIndex = 0;
				}
			}
		}
	}
	return etudiants

}
// REQUETE GET STUDENT ------------------------------------------------------------------------------

app.get('/students', async function(req, res) {
	let students = await etudiantTrié();
	let tab = [];	
	if(students !== undefined){
		for (let i = 0; i < students.length; i++) {
			tab.push(students[i].name);
		}
	}
	res.render('students.ejs', { students: tab , etudiantPris: etudiantPris});
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
				let students = await etudiantTrié();
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
	let students = await etudiantTrié()
	let tabG = [];
	for (let i = 0; i < groups.length; i++) {
		tabG.push(groups[i]);
	}
	res.render('home.ejs', { groups: tabG , students: students});
});

// INITIALISATION SERVER ------------------------------------------------------------------------------

app.listen(3000, function() {
	console.log('server on at http://localhost:3000');
});
