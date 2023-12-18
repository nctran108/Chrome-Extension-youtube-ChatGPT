document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");

  sendButton.addEventListener("click", function () {
    sendMessage();
  });

  userInput.addEventListener("keydown", function (event){
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    if (sender === "You") {
      messageDiv.innerHTML = `<div class="user-message"><strong>${sender}:</strong><span> ${message}</span></div>`;
    }
    else {
      messageDiv.innerHTML = `<div class="bot-message"><strong>${sender}:</strong></div><span>\n${message}</span>`;
    }
    chatMessages.appendChild(messageDiv);
  };
  
  async function sendMessage() {
    const userMessage = userInput.value;
    if (userMessage.trim() != "") {
      appendMessage("You", userMessage);
      // Add logic to send userMessage to backend and get the chatbot's response
      // For simplicity, let's assume the response is obtained immediately
      const message = "get-answer"

      const request = {
        message: message,
        data: userMessage
      }

      const response = await sendMessageToActiveTab(request);

      appendMessage("ChatGPT", response.answer);

      userInput.value = "";
    }
  }  
  async function sendMessageToActiveTab(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log(tab)
    try {
      const response = await chrome.tabs.sendMessage(tab.id, message);
      
      if (chrome.runtime.lastError) {
        // Handle any runtime errors
        console.error("Error sending message:", chrome.runtime.lastError.message);
        return null;
      }
      console.log(response)
      return response;
    } catch (error) {
      console.error("Error sending message:", error.message);
      return null;
    }
    
  }
});



