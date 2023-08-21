const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4002;

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }

    case "CommentCreated": {
      const { id, content, postId } = data;
      const post = posts[postId];
      post.comments.push({ id, content });
      break;
    }

    default:
      break;
  }

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Query service started listening on port: ${PORT}`);
});
