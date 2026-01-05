import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import createCashfreeOrder from "./routes/createCashfreeOrder.js";
import cashfreeWebhook from "./routes/cashfreeWebhook.js";
import checkPaymentStatus from "./routes/checkPaymentStatus.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb", type: "*/*" })); // 👈 important

app.use("/api/createCashfreeOrder", createCashfreeOrder);
app.use("/api/cashfreeWebhook", cashfreeWebhook);
app.use("/api/checkPaymentStatus", checkPaymentStatus);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
