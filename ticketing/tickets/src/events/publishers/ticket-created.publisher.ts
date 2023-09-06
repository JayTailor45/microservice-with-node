import { Publisher, Subjects, TicketCreatedEvent } from "@tjticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
}
