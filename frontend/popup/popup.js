document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");

  // event when click send button
  sendButton.addEventListener("click", function () {
    sendMessage();
  });

  // event when click enter/return keyboard
  userInput.addEventListener("keydown", function (event){
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  // this function append messeges to the popup chat
  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div"); // create message div
    // append message
    if (sender === "You") {
      messageDiv.innerHTML = `<div class="user-message"><strong>${sender}:</strong><span> ${message}</span></div>`;
    }
    else {
      messageDiv.innerHTML = `<div class="bot-message"><strong>${sender}:</strong></div><span>\n${message}</span>`;
    }
    // add messages to chat-messages
    chatMessages.appendChild(messageDiv);
  };
  
  // this function send message to content script
  async function sendMessage() {
    const userMessage = userInput.value;
    // check input message, if not empty then append user message to chat-message
    // then send message to content script to get response from backend
    // then append the chatGPT to the chat-messages
    if (userMessage.trim() != "") {
      appendMessage("You", userMessage); // append user message

      // send message to ask chatGPT
      const message = "get-answer"
      const request = {
        message: message,
        data: userMessage
      }
      const response = await sendMessageToActiveTab(request);

      // append response to chat-messages
      appendMessage("ChatGPT", response.answer);

      userInput.value = "";
    }
  }  

  async function sendMessageToActiveTab(message) {
    // get the current tab
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log(tab)
    try {
      // send message to current tab content script
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



