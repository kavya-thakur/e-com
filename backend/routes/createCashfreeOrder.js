// import express from "express";
// import fetch from "node-fetch";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     console.log("➡️ /createCashfreeOrder called");
//     console.log("Body:", req.body);

//     const { amount, orderId, customer } = req.body;

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds

//     const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
//       method: "POST",
//       signal: controller.signal,
//       headers: {
//         "Content-Type": "application/json",
//         "x-client-id": process.env.CASHFREE_CLIENT_ID,
//         "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
//         "x-api-version": "2022-09-01",
//       },
//       body: JSON.stringify({
//         order_id: orderId,
//         order_amount: amount,
//         order_currency: "INR",
//         customer_details: {
//           customer_id: customer.id,
//           customer_email: customer.email,
//           customer_phone: customer.phone,
//         },
//         order_meta: {
//           return_url:
//             "https://kavyass.vercel.app/payment-result?order_id={order_id}",
//         },
//       }),
//     });

//     clearTimeout(timeout);

//     console.log("Cashfree status:", response.status);

//     const text = await response.text();
//     console.log("Cashfree raw:", text);

//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       return res.status(502).json({
//         ok: false,
//         message: "Cashfree returned invalid response",
//         text,
//       });
//     }

//     return res.json(data);
//   } catch (err) {
//     console.error("❌ Cashfree error:", err.message);

//     return res.status(500).json({
//       ok: false,
//       message: "Cashfree order creation failed",
//       error: err.message,
//     });
//   }
// });

// export default router;
import express from "express";
import fetch from "node-fetch";
import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin"; // Added for better timestamps

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { amount, orderId, customer, metadata } = req.body;
    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);

    // 1. LOG FOR DEBUGGING (Check Render logs to see what metadata arrived)
    console.log("📥 Metadata Received:", JSON.stringify(metadata));

    // 2. SAVE TO FIRESTORE FIRST
    await db
      .collection("orders")
      .doc(String(orderId))
      .set({
        orderId: String(orderId),
        // Fallbacks for common naming mismatches
        userId: metadata?.userId || metadata?.uid || customer?.id || "guest",
        items: metadata?.items || [],
        customer: {
          name: metadata?.customerName || "Customer",
          email: customer?.email || "",
          phone: cleanPhone,
          // Checks 'address' or 'addr'
          address: metadata?.address || metadata?.addr || "No Address Provided",
        },
        pricing: {
          total: Number(amount),
          shipping: Number(metadata?.shipping || 0),
          subtotal: Number(metadata?.subtotal || 0),
        },
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Better than new Date()
        payment_gateway: "cashfree",
      });

    console.log(
      `📡 Pending order saved: ${orderId} for User: ${metadata?.userId}`,
    );

    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: String(orderId),
        order_amount: Number(amount).toFixed(2),
        order_currency: "INR",
        customer_details: {
          customer_id: String(customer.id || "guest"),
          customer_email: customer.email,
          customer_phone: cleanPhone,
        },
        order_note: `Order ${orderId}`,
        order_meta: {
          return_url: `https://kavyass.vercel.app/payment-result?order_id=${orderId}`,
          notify_url: "https://ecommerce-rx1m.onrender.com/api/cashfreewebhook",
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return res.json(data);
  } catch (err) {
    console.error("❌ Backend Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
