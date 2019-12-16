const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose
	.connect(
		'mongodb://mongo:27017/api',
		{ useNewUrlParser: true, useCreateIndex: true }
	)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.error(err));

const User = require('./models/User');
const Task = require('./models/Task');

app.get('/', (req, res) => {
	res.send("Hello World");
});
app.post('/register', (req, res) => {
	const newUser = new User({...req.body});
	newUser.save()
		.then(user => res.json({msg: "Usuario registrado"}))
		.catch(error => res.status(400).json({error, msg: "Usuario no registrado"}));
});
app.post('/login', (req, res) => {
	User.findOne({name: req.body.name, password: req.body.password})
		.then(user => res.json(user))
		.catch(error => res.status(400).json({error, msg: "Usuario no encontrado"}))
});
app.post('/task/add', (req, res) => {
	const newTask = new Task({...req.body});
	newTask.save()
		.then(user => res.json({msg: "Tarea Creada"}))
		.catch(error => res.status(400).json({error, msg: "Tarea no creada"}));
});
app.get('/task/list/', (req, res) => {
	Task.find({userId: req.body.userId, isClosed: false})
		.then(tasks => res.json(tasks))
		.catch(error => res.status(400).json({error, msg: "No se encontraron tareas"}))
});
app.put('/task/edit', (req, res) => {
	Task.findById(req.body.id)
		.then(task => {
			task.name = req.body.name;
			task.isClosed = req.body.isClosed;
			task.save()
				.then(() => res.json({msg: "Tarea actualizada"}))
				.catch(error => res.status(400).json({error, msg: "No se pudo actualizar"}));
		})
		.catch(error => res.status(400).json({error, msg: "No se encontro la tarea"}))
});

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});