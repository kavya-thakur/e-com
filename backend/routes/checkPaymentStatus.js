import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const response = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "x-api-version": "2022-09-01",
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not get status" });
  }
});

export default router;
