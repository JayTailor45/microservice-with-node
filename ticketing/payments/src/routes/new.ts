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

    try {
      await stripe.charges.create({
        currency: "inr",
        description: `A payment of order id ${order.id} for user ${
          req.currentUser!.email
        }`,
        amount: order.price * 100, // Convert into paisa (smallest Indian currency unit)
        source: token,
      });
    } catch (error) {
      console.log(error);
    }

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
