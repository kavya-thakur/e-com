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

    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);

    // 1. Properly scope and calculate the note
    let finalNote = JSON.stringify(metadata || {});

    if (finalNote.length > 250) {
      console.warn("⚠️ Metadata too long, stripping to essentials");
      const minimalMetadata = {
        uid: metadata.userId || metadata.uid || "guest",
        items: (metadata.items || []).map((i) => ({ id: i.id, q: i.qty })),
      };
      finalNote = JSON.stringify(minimalMetadata);
    }

    // 2. Final check: if still over 250 (rare), truncate hard to avoid Cashfree rejection
    if (finalNote.length > 250) {
      finalNote = finalNote.substring(0, 249);
    }

    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        "x-api-version": "2022-09-01",
      },
      // Replace your existing body: JSON.stringify({...}) with this:
      body: JSON.stringify({
        order_id: String(orderId), // Force String
        order_amount: Number(amount).toFixed(2),
        order_currency: "INR",
        customer_details: {
          customer_id: String(customer.id || "guest"), // Force String
          customer_email: String(customer.email),
          customer_phone: String(cleanPhone), // Force String
        },
        order_note: String(finalNote), // Ensure this is a raw string
        order_meta: {
          return_url: `https://kavyass.vercel.app/payment-result?order_id=${orderId}`,
          notify_url: "https://ecommerce-rx1m.onrender.com/api/cashfreewebhook",
        },
      }),
    });
    console.log(
      `DEBUG: Sending Note to Cashfree [Length: ${finalNote.length}]:`,
      finalNote,
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Cashfree API Error:", data);
      return res.status(response.status).json(data);
    }

    console.log("✅ Cashfree Session Created:", data.payment_session_id);
    return res.json(data);
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
