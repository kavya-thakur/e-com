import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!orderId) return;

    async function checkPayment() {
      try {
        const res = await fetch(
          `http://localhost:4000/api/checkPaymentStatus/${orderId}`
        );

        const data = await res.json();

        if (data.order_status === "PAID") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.log(err);
        setStatus("failed");
      }
    }

    checkPayment();
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
