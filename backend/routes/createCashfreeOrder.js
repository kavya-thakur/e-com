import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { amount, orderId, customer } = req.body;

    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: customer.id,
          customer_email: customer.email,
          customer_phone: customer.phone,
        },
        order_meta: {
          return_url:
            "http://localhost:5173/payment-result?order_id={order_id}",
        },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Cashfree error:", err);
    res.status(500).json({ message: "Cashfree order creation failed" });
  }
});

export default router;
