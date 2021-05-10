const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const User = require("./models/User");
const Task = require("./models/Task");
const RefreshToken = require("./models/RefreshToken");

// Middleware
const authenticateJWT = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(400);

  const accessToken = authorization.split(" ")[1];

  jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(400);
    req.user = user;
    next();
  });
};

// Tokens
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });

const generateRefreshToken = (id) => jwt.sign({ id }, process.env.TOKEN_SECRET);

app.post("/register", (req, res) => {
  new User({ ...req.body })
    .save()
    .then((user) => {
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      new RefreshToken({ userId: user.id, refreshToken }).save();
      res.json({ accessToken, refreshToken });
    })
    .catch((error) => res.status(400).json({ error }));
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email, password: req.body.password })
    .then((user) => {
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      new RefreshToken({ userId: user.id, refreshToken }).save();
      res.json({ accessToken, refreshToken });
    })
    .catch((error) => res.status(400).json({ error }));
});

app.post("/refreshToken", (req, res) => {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(400);
  });
  
  RefreshToken.findOne({ refreshToken })
    .then((token) =>
      res.json({
        accessToken: generateAccessToken(token.userId),
      })
    )
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/logout", authenticateJWT, (req, res) => {
  const { id } = req.user;
  RefreshToken.deleteMany({ userId: id })
    .then((tokens) => res.json(tokens))
    .catch((error) => res.status(400).json({ error }));
});

// Users
app.get("/profile", authenticateJWT, (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .then((user) => res.json(user))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/profile", authenticateJWT, (req, res) => {
  const { id } = req.user;
  User.findByIdAndUpdate(id, {
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => res.json(user))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/profile", authenticateJWT, async (req, res) => {
  const { id } = req.user;
  var userPromise = User.findByIdAndDelete(id);
  var taskPromise = Task.deleteMany({ userId: id });
  var refreshTokenPromise = RefreshToken.deleteMany({ userId: id });
  Promise.all([userPromise, taskPromise, refreshTokenPromise])
    .then((values) => res.json(values))
    .catch((error) => res.status(400).json({ error }));
});

// Tasks
app.post("/task/add", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  new Task({ ...req.body, userId })
    .save()
    .then((task) => res.json({ task }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/task/list", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  Task.find({ userId, isClosed: false })
    .then((tasks) => res.json(tasks))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/task/edit", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  Task.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    isClosed: req.body.isClosed,
    userId,
  })
    .then((task) => res.json({ task }))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/task/delete", authenticateJWT, (req, res) => {
  Task.findByIdAndDelete(req.body.id)
    .then((task) => res.json(task))
    .catch((error) => res.status(400).json({ error }));
});

// Start app
app.listen(process.env.APP_PORT, () => {
  console.log(`todo app listening at http://localhost:${process.env.APP_PORT}`);
});
