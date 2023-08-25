const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 4005;

app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((e) => console.log(e));
  axios
    .post("http://comments-srv:4001/events", event)
    .catch((e) => console.log(e));
  axios
    .post("http://query-srv:4002/events", event)
    .catch((e) => console.log(e));
  axios
    .post("http://moderation-srv:4003/events", event)
    .catch((e) => console.log(e));

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(PORT, () => {
  console.log(`Event bus started listening on port: ${PORT}`);
});
