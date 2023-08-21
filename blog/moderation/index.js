const express = require("express");
const axios = require("axios");

const PORT = 4003;

const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  switch (type) {
    case "CommentCreated":
      const status = data.status.includes("orange") ? "rejected" : "approved";
      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          content: data.content,
          status,
        },
      });
      break;

    default:
      break;
  }
  res.send({});
});

app.listen(PORT, () => {
  console.log(`Moderation service started listening on port: ${PORT}`);
});
