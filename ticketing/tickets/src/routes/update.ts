import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  UnAuthorizedError,
  BadRequestError,
} from "@tjticket/common";
import { Ticket } from "../models/ticket";
import { Types as MongooseTypes } from "mongoose";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated.publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    param("id")
      .custom((idValue) => MongooseTypes.ObjectId.isValid(idValue))
      .withMessage("id must be a valid MongoDB ObjectId"),
    body("title").not().isEmpty().withMessage("Title is required string"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and should be greater than 0"),
  ],
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Can not edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
