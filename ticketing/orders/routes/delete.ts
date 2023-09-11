import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
  requireAuth,
} from "@tjticket/common";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
