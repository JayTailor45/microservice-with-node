import { ExpirationCompleteEvent, Publisher, Subjects } from "@tjticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
}
