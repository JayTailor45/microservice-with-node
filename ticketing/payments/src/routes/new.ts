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

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
