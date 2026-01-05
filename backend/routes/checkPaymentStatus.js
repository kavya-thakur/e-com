import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const snap = await db
      .collection("orders")
      .where("order_id", "==", orderId)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.json({ status: "not_found" });
    }

    const order = snap.docs[0].data();

    res.json({
      status: order.status,
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not get status" });
  }
});

export default router;
