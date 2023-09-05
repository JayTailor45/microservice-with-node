import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TickerCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-service";

  onMessage(data: any, msg: Message): void {
    console.log("Event data", msg);
    msg.ack();
  }
}