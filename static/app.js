const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value;
    if (!message) return;

    addMessage("user", message); // Replace the line that calls addMessageToWindow with this line
    messageInput.value = "";

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });
    const { reply } = await response.json();
    addMessage("assistant", reply);
});

async function getAIResponse(prompt) {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
    });
    const data = await response.json();
    return data.reply;
}

function addMessage(sender, message) {
    const windowId = sender === "user" ? "user-response" : "ai-response";
    addMessageToWindow(sender, windowId, message);
}

function addMessageToWindow(sender, windowId, messageText) {
    const windowElement = document.getElementById(windowId);
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    if (sender === "user") {
        messageElement.classList.add("user-message");
        messageElement.style.alignSelf = "flex-end";
    } else {
        messageElement.classList.add("ai-message");
         messageElement.style.alignSelf = "flex-start";
    }



    const messageTextElement = document.createElement("span");
    messageTextElement.textContent = messageText;
    messageElement.appendChild(messageTextElement);

    windowElement.appendChild(messageElement);
    windowElement.scrollTop = windowElement.scrollHeight;
}
