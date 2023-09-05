import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to nats");

  const data = {
    id: "123",
    title: "conf",
    price: 20,
  };

  const jsonString = JSON.stringify(data);

  stan.publish("ticket:created", jsonString, () => {
    console.log("ticket:created event published");
  });
});
