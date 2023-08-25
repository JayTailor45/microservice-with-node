const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 4002;

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }

    case "CommentCreated": {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      post.comments.push({ id, content, status });
      break;
    }

    case "CommentUpdated": {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      const comment = post.comments.find((comment) => comment.id === id);
      comment.status = status;
      comment.content = content;
      break;
    }

    default:
      break;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  console.log("Recieved event: ", req.body.type);

  handleEvent(type, data);

  res.send({});
});

app.listen(PORT, async () => {
  console.log(`Query service started listening on port: ${PORT}`);

  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error);
  }
});
