const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// ✅ Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Handle chatbot request
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  // Replace this with your actual Together.ai call
  const response = await axios.post(
    'https://api.together.xyz/...', // actual endpoint
    {
      prompt: userMessage,
      // other options
    },
    {
      headers: {
        Authorization: `Bearer a26e85e9098fe92f981fe05a8e2d56473ef2eb28d559b97e1d8a21ce8ad79b6e`, // 🔒 safe in server.js
        'Content-Type': 'application/json',
      },
    }
  );

  const botReply = response.data.choices?.[0]?.text || "No reply received.";
  res.json({ reply: botReply });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
