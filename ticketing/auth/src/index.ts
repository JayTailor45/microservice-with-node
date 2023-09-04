import express from "express";
import mongoose from "mongoose";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler, NotFoundError } from "@tjticket/common";

const app = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.get("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  // check if env variables are defined
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not found");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Auth app connected to mongodb");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Auth service listening on port", 3000);
  });
};

start();
