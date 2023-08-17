// Imports
const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

// Init

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 4000;

// Mocking db with in memory data
const posts = {};

// Routes
app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios
    .post("http://localhost:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    })
    .catch(console.log);

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Recieved event: ", req.body.type);
  res.send({});
});

// Starting express server
app.listen(PORT, () => {
  console.log(`Posts service started listening on port: ${PORT}`);
});
