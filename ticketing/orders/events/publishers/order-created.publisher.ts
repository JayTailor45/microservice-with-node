import { Publisher, OrderCreatedEvent, Subjects } from "@tjticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
}
