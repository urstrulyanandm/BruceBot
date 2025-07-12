const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve index.html from "public"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Chat endpoint
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.together.xyz/inference', // Replace with real Together endpoint
      {
        prompt: userMessage,
        model: 'togethercomputer/llama-2-7b-chat', // example
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.output || 'No response';
    res.json({ reply: botReply });
  } catch (err) {
    console.error('Error from Together API:', err?.response?.data || err.message);
    res.status(500).json({ reply: 'Sorry, something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
