import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tjticket/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created.publisher";
import { natsWrapper } from "../src/nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 10 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // .custom((input: string) => {
      //   return mongoose.Types.ObjectId.isValid(input);
      // })
      .withMessage("TicketId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that the ticket is not already reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("The ticket is already reserved");
    }

    // Calculate expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.CREATED,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying the order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
