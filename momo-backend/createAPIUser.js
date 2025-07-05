// createApiUser.js
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const referenceId = uuidv4(); // Save this — it's your MOMO_API_USER_ID

axios
  .post(
    "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser",
    {
      providerCallbackHost: "https://yourdomain.com", // use placeholder if testing
    },
    {
      headers: {
        "X-Reference-Id": referenceId,
        "Ocp-Apim-Subscription-Key": "YOUR_SUBSCRIPTION_KEY",
        "Content-Type": "application/json",
      },
    }
  )
  .then(() => {
    console.log("✅ API user created");
    console.log("👉 X-Reference-Id (API_USER_ID):", referenceId);
  })
  .catch((err) => {
    console.error("❌ Error:", err.response?.data || err.message);
  });
