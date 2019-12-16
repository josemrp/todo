const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

app.get('/', (req, res) => res.send("Hello world"));
app.get('/login', (req, res) => res.send("Hello login"));
app.get('/register', (req, res) => res.send("Hello register"));


app.listen(port, () => console.log('Server runninbnmbnng...'));