const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function reading() {
	let read = await fetch('http://localhost:8080/Students');
	let respons = await read.json();
	return respons;
}

async function readingGroups() {
    let read = await fetch("http://localhost:8080/Groups");
    let respons = await read.json();
    return respons;
  }

app.get('/students', async function(req, res) {
	let students = await reading();
	let tab = [];
	for (let i = 0; i < students.length; i++) {
		tab.push(students[i].name);
	}
	res.render('students.ejs', { students: tab });
});

app.get("/groups", async function (req, res) {
    let groups = await readingGroups();
    let tabG = [];
  
    for (let i = 0; i < groups.length; i++) {
      tabG.push(groups[i]);
    }
  
    res.render("groups.ejs", { groups: tabG });
  });


app.listen(3000, function() {
	console.log('server connected');
});
