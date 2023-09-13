import express from "express";
import mongoose from "mongoose";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@tjticket/common";
import { natsWrapper } from "./nats-wrapper";

import { newOrderRouter } from "../routes/new";
import { showOrderRouter } from "../routes/show";
import { deleteOrderRouter } from "../routes/delete";
import { indexOrderRouter } from "../routes";
import { TicketCreatedListener } from "../events/listeners/ticket-created.listener";
import { TicketUpdatedListener } from "../events/listeners/ticket-updated.listener";
import { ExpirationCompleteListener } from "../events/listeners/expiration-complete.listener";
import { PaymentCreatedListener } from "../events/listeners/payment-create.listener";

const app = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(newOrderRouter);

app.get("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  // check if env variables are defined
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URL is not found");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL is not found");
  }
  if (!process.env.NATS_CLUSTER) {
    throw new Error("NATS_CLUSTER is not found");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is not found");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER,
      process.env.NATS_CLIENT_ID, // <-- Client id will be pod id/name
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Order app connected to mongodb");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Order service listening on port", 3000);
  });
};

start();
