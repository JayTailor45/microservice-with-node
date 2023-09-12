import Queue from "bull";

type Payload = {
  orderId: string;
};

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    "Publish expiration:complete event for order id ",
    job.data.orderId
  );
});

export { expirationQueue };
