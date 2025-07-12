const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
const TOGETHER_API_KEY = "a26e85e9098fe92f981fe05a8e2d56473ef2eb28d559b97e1d8a21ce8ad79b6e"; // 🔐 Replace this
const MODEL = "meta-llama/Llama-3-8b-chat-hf";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html, script.js

let messageHistory = [
  { role: "system", content: "You are a helpful assistant." }
];

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  messageHistory.push({ role: "user", content: userMessage });

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: MODEL,
        messages: messageHistory,
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data.choices[0].message.content;
    messageHistory.push({ role: "assistant", content: botReply });

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Together.ai error:", err.response?.data || err.message);
    res.status(500).json({ reply: "Error talking to AI." });
  }
});

app.listen(PORT, () => {
  console.log(`🔮 Server running at http://localhost:${PORT}`);
});
