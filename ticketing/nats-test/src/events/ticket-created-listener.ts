import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TickerCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data", msg);
    msg.ack();
  }
}
