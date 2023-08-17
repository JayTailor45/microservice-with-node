// Imports
const express = require("express");
const { randomBytes } = require("crypto");

// Init

const app = express();
app.use(express.json());

const PORT = 4000;

// Mocking db with in memory data
const posts = {};

// Routes
app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  res.status(201).send(posts[id]);
});

// Starting express server
app.listen(PORT, () => {
  console.log(`Posts service started listening on port: ${PORT}`);
});
