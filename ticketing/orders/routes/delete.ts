import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
  requireAuth,
} from "@tjticket/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled.publisher";
import { natsWrapper } from "../src/nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
