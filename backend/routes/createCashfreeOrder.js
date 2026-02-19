import express from "express";
import fetch from "node-fetch";
import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { amount, orderId, customer, metadata } = req.body;
    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);

    console.log("📥 Metadata Received:", JSON.stringify(metadata));

    await db
      .collection("orders")
      .doc(String(orderId))
      .set({
        orderId: String(orderId),
        userId: metadata?.userId || metadata?.uid || customer?.id || "guest",
        items: metadata?.items || [],
        customer: {
          name: metadata?.customerName || "Customer",
          email: customer?.email || "",
          phone: cleanPhone,
          address: metadata?.address || metadata?.addr || "No Address Provided",
        },
        pricing: {
          total: Number(amount),
          shipping: Number(metadata?.shipping || 0),
          subtotal: Number(metadata?.subtotal || 0),
        },
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        payment_gateway: "cashfree",
      });

    console.log(
      ` Pending order saved: ${orderId} for User: ${metadata?.userId}`,
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
