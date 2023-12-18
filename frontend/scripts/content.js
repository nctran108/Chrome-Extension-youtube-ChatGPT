chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  new Promise(async send => {
    if (message.message === 'get-answer') {
      console.log(message.data)
      const tab = window.location.href;
      const data = {user_input: message.data,
                    videoID: getYouTubeVideoId(tab)}
      const request = {
        method: 'POST',
        body: JSON.stringify(data)
      }
      const answer = await talk_to_backend('http://localhost:5000/response',request);
      const response = {
        message: 'responsed',
        answer: answer.answer
      }
      console.log(response)
      send(response)
    }
  }).then(sendResponse)
  
  return true;
});

function getYouTubeVideoId(tab) {
  const params = new URLSearchParams(new URL(tab).search);
  return params.get("v") || ""; // Extract video ID from URL parameters
}

async function talk_to_backend(url,request) {
  try {
    const response = await fetch(url,request);
    const data = await response.json()
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

