const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");

// Init
const app = express();
const PORT = 4001;

app.use(express.json());
app.use(cors());

// Mocking db with in memory data
const commentsByPostsId = {};

// Routes
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostsId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const { content } = req.body;

  const postId = req.params.id;
  const commentId = randomBytes(4).toString("hex");

  const comments = commentsByPostsId[postId] || [];

  comments.push({ id: commentId, content });

  commentsByPostsId[postId] = comments;

  res.status(201).send(comments);
});

// Starting express server

app.listen(PORT, () => {
  console.log(`Comments service started listening on port: ${PORT}`);
});
