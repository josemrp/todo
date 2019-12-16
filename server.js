const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose
	.connect(
		'mongodb://mongo:27017/app',
		{ useNewUrlParser: true, useCreateIndex: true }
	)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.error(err));

const User = require('./models/User');

app.get('/', (req, res) => {
	res.send("Hello World");
});
app.post('/register', (req, res) => {
	const newUser = new User({...req.body});
	newUser.save()
		.then(user => res.json({msg: "Usuario registrado"}))
		.catch(error => res.json({error, msg: "Usuario no registrado"}));
});
app.post('/login', (req, res) => {
	User.findOne({name: req.body.name, password: req.body.password})
		.then(user => res.json(user))
		.catch(error => res.json({error, msg: "Usuario no encontrado"}))
});

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});