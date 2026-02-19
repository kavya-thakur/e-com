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

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = req.body;
    console.log("🔔 Webhook received for Order:", event?.data?.order?.order_id);

    const orderId = event?.data?.order?.order_id;
    const paymentStatus = event?.data?.payment?.payment_status;
    const orderNote = event?.data?.order?.order_note; // This is our metadata string

    if (!orderId) return res.status(400).send("No order id");

    // --- STRATEGY: ONLY SAVE ON SUCCESS ---
    if (paymentStatus === "SUCCESS") {
      if (!orderNote) {
        console.error("❌ No metadata found in order_note for success payment");
        return res.status(400).send("Missing order metadata");
      }

      // 1. Parse the stringified metadata back into an object
      const details = JSON.parse(orderNote);

      // 2. Create the document in the 'orders' collection
      // We use .doc(orderId).set() to prevent any potential duplicate saves
      await db
        .collection("orders")
        .doc(orderId)
        .set({
          order_id: orderId,
          status: "paid",
          items: details.items,
          customer: {
            name: details.customerName,
            address: details.address,
            email: details.email,
            phone: details.phone,
          },
          userId: details.userId,
          pricing: {
            subtotal: details.subtotal,
            shipping: details.shipping,
            total: details.total,
          },
          paidAt: new Date(), // Server timestamp for payment
          createdAt: new Date(), // Server timestamp for record creation
          payment_gateway: "cashfree",
        });

      console.log(`✅ Order ${orderId} successfully created in Firestore.`);
      return res.status(200).send("Order Created");
    }

    // --- STRATEGY: IGNORE NON-SUCCESS EVENTS ---
    // We don't save FAILED or CANCELLED orders to keep the DB clean
    console.log(
      `ℹ️ Payment status is ${paymentStatus}. No document created for ${orderId}.`,
    );
    res.status(200).send("Webhook acknowledged without creation");
  } catch (err) {
    console.error("❌ Webhook processing failed:", err);
    res.status(500).send("fail");
  }
});

export default router;
