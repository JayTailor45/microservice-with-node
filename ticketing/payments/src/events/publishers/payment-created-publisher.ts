import { PaymentCreatedEvent, Publisher, Subjects } from "@tjticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
}
