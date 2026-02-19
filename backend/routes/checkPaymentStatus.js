import express from "express";
import fetch from "node-fetch"; // Ensure node-fetch is installed

const router = express.Router();

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log(`🔍 Checking Live Cashfree Status for: ${orderId}`);

    // Talk directly to Cashfree API instead of Firestore
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
      return res
        .status(response.status)
        .json({ status: "error", message: "Cashfree API error" });
    }

    const data = await response.json();

    /* Cashfree Order Statuses:
       - PAID: Payment successful
       - ACTIVE: Link generated, payment pending
       - EXPIRED: User didn't pay in time
    */

    let status = "pending_payment";
    if (data.order_status === "PAID") status = "paid";
    if (data.order_status === "EXPIRED" || data.order_status === "TERMINATED")
      status = "failed";

    console.log(`✅ Live Status for ${orderId}: ${status}`);

    res.json({
      status: status,
      order_id: orderId,
      // We don't have the full Firestore 'order' object yet because the webhook
      // is still working, so we just return the status.
    });
  } catch (err) {
    console.error("Payment Check Error:", err);
    res.status(500).json({ message: "Could not verify payment status" });
  }
});

export default router;
