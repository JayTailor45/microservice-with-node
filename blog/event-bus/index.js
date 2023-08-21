const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 4005;

app.use(express.json());

app.post("/events", (req, res) => {
  const event = req.body;

  axios
    .post("http://localhost:4000/events", event)
    .catch((e) => console.log(e));
  axios
    .post("http://localhost:4001/events", event)
    .catch((e) => console.log(e));
  axios
    .post("http://localhost:4002/events", event)
    .catch((e) => console.log(e));

  res.send({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Event bus started listening on port: ${PORT}`);
});
