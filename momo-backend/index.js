const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MOMO_BASE_URL = "https://sandbox.momodeveloper.mtn.com";

let accessToken = null;

// 🔐 Get Access Token
async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.MOMO_API_USER_ID}:${process.env.MOMO_API_KEY}`
  ).toString("base64");

  const res = await axios.post(`${MOMO_BASE_URL}/collection/token/`, null, {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": process.env.MOMO_SUBSCRIPTION_KEY,
    },
  });

  return res.data.access_token;
}

// 📥 Initiate Payment
app.post("/api/momo/pay", async (req, res) => {
  const { phone, amount, externalId, payerMessage } = req.body;

  try {
    if (!accessToken) {
      accessToken = await getAccessToken();
    }

    const referenceId = uuidv4();

    await axios.post(
      `${MOMO_BASE_URL}/collection/v1_0/requesttopay`,
      {
        amount: `${amount}`,
        currency: process.env.MOMO_CURRENCY,
        externalId,
        payer: {
          partyIdType: "MSISDN",
          partyId: phone,
        },
        payerMessage,
        payeeNote: "ReezBlank Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": process.env.MOMO_ENVIRONMENT,
          "Ocp-Apim-Subscription-Key": process.env.MOMO_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Payment initiated successfully" });
  } catch (error) {
    console.error("MoMo Payment Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "MoMo Payment failed" });
  }
});

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("MoMo backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
