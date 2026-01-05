import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = req.body;

    console.log("Webhook received:", event);

    const orderId = event?.data?.order?.order_id;
    const paymentStatus = event?.data?.payment?.payment_status;

    if (!orderId) return res.status(400).send("No order id");

    let status = "pending_payment";
    if (paymentStatus === "SUCCESS") status = "paid";
    if (paymentStatus === "FAILED") status = "failed";

    const snap = await db
      .collection("orders")
      .where("order_id", "==", orderId)
      .get();

    if (snap.empty) {
      console.log("No order found for", orderId);
      return res.status(404).send("Order not found");
    }

    snap.forEach((doc) => {
      doc.ref.update({
        status,
        paidAt: new Date(),
      });
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("fail");
  }
});

export default router;
