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
    const dialogue = message.match(/"([^"]*?)"/);
    const thought = message.match(/\[([^\]]*?)\]/);
    const action = message.match(/\*([^*]+)\*/);


    if (sender === "user") {
        addMessageToWindow(sender, "dialogues", message);
    } else {
        if (thought) {
            addMessageToWindow(sender, "thoughts", thought[1]);
        }

        if (dialogue) {
            addMessageToWindow(sender, "dialogues", dialogue[1]);
        }

        if (action) {
            addMessageToWindow(sender, "actions", action[1]);
        }
    }
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

    const profileImage = document.createElement("img");
    profileImage.src = sender === "user" ? "static/user-profile.jpg" : "static/ai-profile.jpg";
    profileImage.classList.add("profile-image");
    if (sender !== "user") {
        profileImage.classList.add("ai-profile-image");
    }
    profileImage.alt = sender === "user" ? "User Profile" : "AI Profile";
    messageElement.appendChild(profileImage);

    const messageTextElement = document.createElement("span");
    messageTextElement.textContent = messageText;
    messageElement.appendChild(messageTextElement);

    windowElement.appendChild(messageElement);
    windowElement.scrollTop = windowElement.scrollHeight;
}
