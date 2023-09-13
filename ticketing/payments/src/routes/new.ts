import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
  requireAuth,
} from "@tjticket/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestError("Cannot play for cancelled order");
    }

    const stripeResponse = await stripe.charges.create({
      currency: "inr",
      description: `A payment of order id ${order.id} for user ${
        req.currentUser!.email
      }`,
      amount: order.price * 100, // Convert into paisa (smallest Indian currency unit)
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: stripeResponse.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
