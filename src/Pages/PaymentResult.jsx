import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!orderId) return;

    async function checkPayment() {
      try {
        const res = await fetch(
          `https://ecommerce-rx1m.onrender.com/api/checkPaymentStatus/${orderId}`,
        );

        const data = await res.json();

        if (data.status === "paid") {
          setStatus("success");
          return;
        }

        if (data.status === "pending_payment") {
          setStatus("checking");
          return;
        }

        setStatus("failed");
      } catch (err) {
        console.log(err);
        setStatus("failed");
      }
    }

    checkPayment();

    const interval = setInterval(checkPayment, 4000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (status === "checking")
    return (
      <div className="p-10 text-center">Checking payment… please wait</div>
    );

  if (status === "success")
    return (
      <div className="p-10 text-center">
        🎉 Payment Successful — your order is confirmed!
      </div>
    );

  return <div className="p-10 text-center">❌ Payment failed or cancelled</div>;
}
