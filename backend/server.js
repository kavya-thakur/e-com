import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import createCashfreeOrder from "./routes/createCashfreeOrder.js";
import cashfreeWebhook from "./routes/cashfreeWebhook.js";
import checkPaymentStatus from "./routes/checkPaymentStatus.js";
dotenv.config();
console.log("CF CLIENT:", process.env.CASHFREE_CLIENT_ID);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👉 use the separate route file
app.use("/api/createCashfreeOrder", createCashfreeOrder);
app.use("/api/cashfreeWebhook", cashfreeWebhook);
app.use("/api/checkPaymentStatus", checkPaymentStatus);

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
