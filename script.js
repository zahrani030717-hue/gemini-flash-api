const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

const conversation = [];

function appendMessage(role, text) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.classList.add(role);

  div.textContent = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;

  return div;
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();

  if (!userMessage) return;

  appendMessage("user", userMessage);

  conversation.push({
    role: "user",
    text: userMessage,
  });

  input.value = "";

  const thinkingMessage = appendMessage(
    "bot",
    "Gemini sedang berpikir..."
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation,
      }),
    });

    const data = await response.json();

    if (data.result) {
      thinkingMessage.textContent = data.result;

      conversation.push({
        role: "model",
        text: data.result,
      });
    } else {
      thinkingMessage.textContent =
        "Sorry, no response received.";
    }
  } catch (error) {
    thinkingMessage.textContent =
      "Failed to get response from server.";
  }
});