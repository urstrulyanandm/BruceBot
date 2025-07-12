const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ POST endpoint for chatbot
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions', // Use the correct endpoint
      {
        model: 'meta-llama/Llama-3-8b-chat-hf',
        messages: [
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.choices?.[0]?.message?.content || "No reply received.";
    res.json({ reply: botReply });

  } catch (error) {
    console.error('Error from Together API:', error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
