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

    // Safety check: Log the raw structure if debugging
    // console.log("FULL WEBHOOK BODY:", JSON.stringify(event));

    const orderData = event?.data?.order;
    const paymentData = event?.data?.payment;
    const orderId = orderData?.order_id;
    const paymentStatus = paymentData?.payment_status;
    const orderNote = orderData?.order_note;

    console.log(
      `🔔 Webhook received for Order: ${orderId} | Status: ${paymentStatus}`,
    );

    if (!orderId) return res.status(400).send("No order id");

    if (paymentStatus === "SUCCESS") {
      // If orderNote is missing, we log it but try to save a basic record anyway
      // so you don't lose the payment information!
      if (!orderNote) {
        console.error(
          "❌ No metadata found in order_note. Saving basic order info.",
        );
        await db.collection("orders").doc(orderId).set(
          {
            order_id: orderId,
            status: "paid_missing_metadata",
            total: orderData.order_amount,
            cf_payment_id: paymentData.cf_payment_id,
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
            payment_gateway: "cashfree",
            manual_check_required: true,
          },
          { merge: true },
        );

        return res.status(200).send("Acknowledge missing metadata");
      }

      let details;
      try {
        details = JSON.parse(orderNote);
      } catch (e) {
        console.error("❌ JSON Parse Error on order_note:", orderNote);
        details = {}; // Fallback
      }

      // --- SMART MAPPING ---
      await db
        .collection("orders")
        .doc(orderId)
        .set(
          {
            order_id: orderId,
            status: "paid",
            items:
              details.items?.map((item) => ({
                id: item.id || "unknown",
                qty: item.q || item.qty || 1,
                name: item.name || "Product",
              })) || [],
            customer: {
              name: details.customerName || "Customer",
              address: details.address || details.addr || "Address in Profile",
              email: details.email || "",
              phone: details.phone || "",
            },
            userId: details.userId || details.uid || "guest",
            pricing: {
              subtotal: details.subtotal || 0,
              shipping: details.shipping || 0,
              total: details.total || orderData.order_amount,
            },
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            payment_gateway: "cashfree",
            cashfree_reference: paymentData.cf_payment_id,
          },
          { merge: true },
        );

      console.log(`✅ Order ${orderId} saved to Firestore.`);
      return res.status(200).send("Order Created");
    }

    console.log(`ℹ️ Status ${paymentStatus}. No doc created for ${orderId}.`);
    res.status(200).send("Acknowledged");
  } catch (err) {
    console.error("❌ Webhook processing failed:", err);
    res.status(500).send("fail");
  }
});

export default router;
