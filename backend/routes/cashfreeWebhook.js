import express from "express";
import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = req.body;
    const orderData = event?.data?.order;
    const paymentData = event?.data?.payment;

    const orderId = orderData?.order_id;
    const paymentStatus = paymentData?.payment_status;

    console.log(
      `🔔 Webhook Received: Order ${orderId} | Status: ${paymentStatus}`,
    );

    if (!orderId) {
      return res.status(400).send("No order id in payload");
    }

    if (paymentStatus === "SUCCESS") {
      const orderRef = db.collection("orders").doc(orderId);
      const doc = await orderRef.get();

      if (!doc.exists) {
        console.warn(
          `⚠️ Order ${orderId} not found in DB. Creating fallback record.`,
        );
        await orderRef.set(
          {
            order_id: orderId,
            status: "paid_manual_verify",
            total: orderData?.order_amount,
            cf_payment_id: paymentData?.cf_payment_id,
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
            payment_gateway: "cashfree",
            note: "Metadata missing because document was not pre-saved.",
          },
          { merge: true },
        );
      } else {
        await orderRef.update({
          status: "paid",
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          cf_payment_id: paymentData?.cf_payment_id,
          payment_details: paymentData,
        });
      }

      console.log(`✅ Order ${orderId} successfully marked as PAID.`);
      return res.status(200).send("OK");
    }
    if (paymentStatus === "FAILED") {
      await db
        .collection("orders")
        .doc(orderId)
        .update({
          status: "failed",
          last_updated: admin.firestore.FieldValue.serverTimestamp(),
        })
        .catch(() => {});
    }

    res.status(200).send("Acknowledged");
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);

    res.status(200).send("Processed with error");
  }
});

export default router;
