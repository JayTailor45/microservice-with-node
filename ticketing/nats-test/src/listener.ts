import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TickerCreatedListener } from "./events/ticket-created-listener";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to nats");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TickerCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
