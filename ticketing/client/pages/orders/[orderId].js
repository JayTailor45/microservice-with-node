import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log(payment);
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const intervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired!</div>;
  }

  return (
    <div>
      <div>Time left to pay: {timeLeft} seconds </div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51I6KDdKyOYnccYaTfaty0BTtUPy3xCXEPW9NzFwB5HN4lLz4fWd1ksGMIgIirTMnINxCqwsslIzafB1Eez96qTPD00Qb57e302"
        currency="INR"
        amount={order.ticket.price}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
