import { Publisher, Subjects, TicketUpdatedEvent } from "@tjticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TICKET_UPDATED;
}
