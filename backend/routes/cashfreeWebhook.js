import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = req.body;

    console.log("Webhook received:", event);

    const orderId = event?.data?.order?.order_id;
    const status = event?.data?.order?.order_status;

    if (!orderId) return res.status(400).send("No order id");

    await db.collection("orders").doc(orderId).update({
      status,
      paidAt: new Date(),
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("fail");
  }
});

export default router;
