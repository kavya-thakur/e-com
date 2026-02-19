import express from "express";
import fetch from "node-fetch";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderDoc = await db.collection("orders").doc(orderId).get();
    const orderData = orderDoc.data();

    if (orderData?.status === "paid") {
      return res.json({ status: "paid", order_id: orderId });
    }
    if (orderData?.status === "failed") {
      return res.json({ status: "failed", order_id: orderId });
    }

    const response = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "x-api-version": "2022-09-01",
        },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({ status: "error" });
    }

    const data = await response.json();
    let status = "checking";
    const cfStatus = data.order_status?.toUpperCase();

    if (cfStatus === "PAID") {
      status = "paid";
    } else if (
      ["FAILED", "CANCELLED", "EXPIRED", "USER_DROPPED"].includes(cfStatus)
    ) {
      status = "failed";
    } else if (cfStatus === "ACTIVE") {
      status = "checking";
    } else {
      status = "failed";
    }

    return res.json({ status, order_id: orderId });
  } catch (err) {
    console.error("Payment Check Error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Verification failed" });
    }
  }
});

export default router;
