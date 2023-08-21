const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

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

app.post("/posts/:id/comments", async (req, res) => {
  const { content } = req.body;

  const postId = req.params.id;
  const commentId = randomBytes(4).toString("hex");

  const comments = commentsByPostsId[postId] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostsId[postId] = comments;

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        postId,
        content,
        status: "pending",
      },
    })
    .catch(console.log);

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Recieved event: ", req.body.type);

  const { type, data } = req.body;
  switch (type) {
    case "CommentModerated":
      const { id, postId, status } = req.body;
      const comments = commentsByPostsId[postId];
      const comment = comments.find((comment) => commentId === comment.id);
      comment.status = status;

      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      });
      break;

    default:
      break;
  }

  res.send({});
});

// Starting express server

app.listen(PORT, () => {
  console.log(`Comments service started listening on port: ${PORT}`);
});
