const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose
  //.connect("mongodb://localhost:27017/mongo", {
  .connect("mongodb://mongo:27017/mongo", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const User = require("./models/User");
const Task = require("./models/Task");

// Users
app.post("/register", (req, res) => {
  const newUser = new User({ ...req.body });
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((error) => res.status(400).json({ error }));
});

app.post("/login", (req, res) => {
  User.findOne({ name: req.body.name, password: req.body.password })
    .then((user) => res.json(user))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/profile/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/profile/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => res.json(user))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/profile/:id", async (req, res) => {
  var userPromise = User.findByIdAndDelete(req.params.id);
  var taskPromise = Task.deleteMany({ userId: req.params.id });
  Promise.all([userPromise, taskPromise])
    .then((values) => res.json(values))
    .catch((error) => res.status(400).json({ error }));
});

// Tasks
app.post("/task/add", (req, res) => {
  const newTask = new Task({ ...req.body });
  newTask
    .save()
    .then((user) => res.json({ newTask }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/task/list/:userId", (req, res) => {
  Task.find({ userId: req.params.userId, isClosed: false })
    .then((tasks) => res.json(tasks))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/task/edit", (req, res) => {
  Task.findById(req.body.id)
    .then((task) => {
      task.name = req.body.name;
      task.isClosed = req.body.isClosed;
      task
        .save()
        .then(() => res.json({ task }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/task/delete", (req, res) => {
  Task.findByIdAndDelete(req.body.id)
    .then((task) => res.json(task))
    .catch((error) => res.status(400).json({ error }));
});

app.listen(port, () => {
  console.log(`todo app listening at http://localhost:${port}`);
});
