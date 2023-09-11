import { OrderCancelledEvent, Publisher, Subjects } from "@tjticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.ORDER_CANCELLED;
}
