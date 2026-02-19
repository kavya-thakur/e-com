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

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("➡️ /createCashfreeOrder called");
    const { amount, orderId, customer, metadata } = req.body;

    // 1. Sanitize Phone Number (Strict 10 digits for Cashfree)
    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);

    // 2. Prepare Order Note (Truncate if too long for Cashfree limits)
    const orderNote = JSON.stringify(metadata).substring(0, 500);

    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(amount).toFixed(2), // Ensure numeric format
        order_currency: "INR",
        customer_details: {
          customer_id: customer.id || "guest",
          customer_email: customer.email,
          customer_phone: cleanPhone,
        },
        order_note: orderNote,
        order_meta: {
          return_url: `https://kavyass.vercel.app/payment-result?order_id=${orderId}`,
          notify_url: "https://ecommerce-rx1m.onrender.com/api/cashfreewebhook",
        },
      }),
    });

    const data = await response.json();

    // 3. Handle Cashfree Rejection (Crucial!)
    if (!response.ok) {
      console.error("❌ Cashfree API Error:", data);
      return res.status(response.status).json({
        success: false,
        message: data.message || "Cashfree initialization failed",
        details: data,
      });
    }

    // 4. Success
    console.log("✅ Cashfree Session Created:", data.payment_session_id);
    return res.json(data);
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

export default router;
