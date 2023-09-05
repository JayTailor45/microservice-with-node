import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to nats");

  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group"
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(
        `Received event #${msg.getSequence()}, with data: ${JSON.stringify(
          JSON.parse(data),
          null,
          2
        )}`
      );
    }
  });
});
