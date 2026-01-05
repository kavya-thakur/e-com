import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const r = await fetch(
      "https://695116da70e1605a10893d60.mockapi.io/api/v1/products"
    );

    const data = await r.json();

    res.json(data); // your backend automatically adds CORS headers
  } catch (err) {
    console.error("Products fetch error:", err);
    res.status(500).json({ message: "Could not load products" });
  }
});

export default router;
