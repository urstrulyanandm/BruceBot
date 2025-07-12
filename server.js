const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chatbot endpoint
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          { role: 'system', content: 'You are BruceBot, a helpful assistant.' },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer a26e85e9098fe92f981fe05a8e2d56473ef2eb28d559b97e1d8a21ce8ad79b6e`, // Replace this
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.choices?.[0]?.message?.content || "No reply.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
