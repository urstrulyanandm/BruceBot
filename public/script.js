const chatBox = document.getElementById("chat");
const inputBox = document.getElementById("inputBox");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {
  const userInput = inputBox.value.trim();
  if (!userInput) return;

  appendMessage("user", userInput);
  inputBox.value = "";

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput })
  });

  const data = await response.json();
  appendMessage("bot", data.reply);
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
