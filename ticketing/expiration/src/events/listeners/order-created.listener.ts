import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@tjticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {}
}
