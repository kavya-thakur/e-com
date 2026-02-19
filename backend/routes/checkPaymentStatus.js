import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

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

    // LOGIC FIX:
    // Anything that isn't SUCCESS or currently in-progress is a FAILURE.
    let status = "pending_payment";

    if (data.order_status === "PAID") {
      status = "paid";
    } else if (data.order_status === "ACTIVE") {
      // User still has the payment window open
      status = "pending_payment";
    } else {
      // Covers: DROPPED, CANCELLED, EXPIRED, TERMINATED, FAILED
      console.log(`❌ Transaction result for ${orderId}: ${data.order_status}`);
      status = "failed";
    }

    res.json({
      status: status,
      order_id: orderId,
    });
  } catch (err) {
    console.error("Payment Check Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;
