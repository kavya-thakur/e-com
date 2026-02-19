// import express from "express";
// import { db } from "../firebaseAdmin.js";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const event = req.body;

//     console.log("Webhook received:", event);

//     const orderId = event?.data?.order?.order_id;
//     const paymentStatus = event?.data?.payment?.payment_status;

//     if (!orderId) return res.status(400).send("No order id");

//     let status = "pending_payment";
//     if (paymentStatus === "SUCCESS") status = "paid";
//     if (paymentStatus === "FAILED") status = "failed";

//     const snap = await db
//       .collection("orders")
//       .where("order_id", "==", orderId)
//       .get();

//     if (snap.empty) {
//       console.log("No order found for", orderId);
//       return res.status(404).send("Order not found");
//     }

//     snap.forEach((doc) => {
//       doc.ref.update({
//         status,
//         paidAt: new Date(),
//       });
//     });

//     res.status(200).send("OK");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("fail");
//   }
// });

// export default router;
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

    // Process only on SUCCESS
    if (paymentStatus === "SUCCESS") {
      const orderRef = db.collection("orders").doc(orderId);
      const doc = await orderRef.get();

      if (!doc.exists) {
        // If the backend failed to save the 'pending' order for some reason,
        // we create a fallback record so the money isn't "lost"
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
        // Normal Flow: Update the pre-saved pending order
        await orderRef.update({
          status: "paid",
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          cf_payment_id: paymentData?.cf_payment_id,
          // We store the full payment object for safety
          payment_details: paymentData,
        });
      }

      console.log(`✅ Order ${orderId} successfully marked as PAID.`);
      return res.status(200).send("OK");
    }

    // Handle other statuses (FAILED, CANCELLED) if you want to track them
    if (paymentStatus === "FAILED") {
      await db
        .collection("orders")
        .doc(orderId)
        .update({
          status: "failed",
          last_updated: admin.firestore.FieldValue.serverTimestamp(),
        })
        .catch(() => {}); // Ignore error if doc doesn't exist
    }

    res.status(200).send("Acknowledged");
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);
    // Always return 200 to Cashfree unless it's a critical server crash,
    // otherwise Cashfree will keep retrying and spamming your logs.
    res.status(200).send("Processed with error");
  }
});

export default router;
