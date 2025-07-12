document.getElementById('sendBtn').addEventListener('click', async () => {
  const inputBox = document.getElementById('inputBox');
  const chat = document.getElementById('chat');
  const userMessage = inputBox.value.trim();

  if (!userMessage) return;

  // Display user message
  const userMsgElem = document.createElement('div');
  userMsgElem.className = 'msg user';
  userMsgElem.textContent = userMessage;
  chat.appendChild(userMsgElem);
  inputBox.value = '';

  // Scroll down
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch('/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    // Display bot reply
    const botMsgElem = document.createElement('div');
    botMsgElem.className = 'msg bot';
    botMsgElem.textContent = data.reply;
    chat.appendChild(botMsgElem);
    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    console.error('Error:', err);
    const errorMsg = document.createElement('div');
    errorMsg.className = 'msg bot';
    errorMsg.textContent = '⚠️ BruceBot is currently offline. Please try again later.';
    chat.appendChild(errorMsg);
    chat.scrollTop = chat.scrollHeight;
  }
});
