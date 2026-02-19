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
import admin from "firebase-admin"; // To use serverTimestamp

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = req.body;
    const orderData = event?.data?.order;
    const paymentData = event?.data?.payment;

    console.log("🔔 Webhook received for Order:", orderData?.order_id);

    const orderId = orderData?.order_id;
    const paymentStatus = paymentData?.payment_status;
    const orderNote = orderData?.order_note;

    if (!orderId) return res.status(400).send("No order id");

    if (paymentStatus === "SUCCESS") {
      if (!orderNote) {
        console.error("❌ No metadata found in order_note");
        return res.status(400).send("Missing order metadata");
      }

      const details = JSON.parse(orderNote);

      // --- SMART MAPPING ---
      // This handles both the "Full" metadata and the "Minimal" (slim) version
      await db
        .collection("orders")
        .doc(orderId)
        .set(
          {
            order_id: orderId,
            status: "paid",
            // Use .q (slim) or .qty (full)
            items:
              details.items?.map((item) => ({
                id: item.id,
                qty: item.q || item.qty || 1,
                name: item.name || "Product",
              })) || [],
            customer: {
              name: details.customerName || "Customer",
              address:
                details.address || details.addr || "Address in User Profile",
              email: details.email || "",
              phone: details.phone || "",
            },
            userId: details.userId || details.uid || "guest",
            pricing: {
              subtotal: details.subtotal || 0,
              shipping: details.shipping || 0,
              total: details.total || orderData.order_amount, // Fallback to Cashfree's amount
            },
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            payment_gateway: "cashfree",
            cashfree_reference: paymentData.cf_payment_id,
          },
          { merge: true },
        );

      console.log(`✅ Order ${orderId} successfully created in Firestore.`);
      return res.status(200).send("Order Created");
    }

    console.log(
      `ℹ️ Payment status is ${paymentStatus}. No creation for ${orderId}.`,
    );
    res.status(200).send("Acknowledged");
  } catch (err) {
    console.error("❌ Webhook processing failed:", err);
    res.status(500).send("fail");
  }
});

export default router;
