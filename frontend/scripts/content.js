chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  new Promise(async send => { // listen message async from popup
    if (message.message === 'get-answer') {
      console.log(message.data)
      const tab = window.location.href; // get the tab object
      // create data object to send to back-end with videoID and user question
      const data = {user_input: message.data,
                    videoID: getYouTubeVideoId(tab)}
      const request = {
        method: 'POST',
        body: JSON.stringify(data)
      }
      // send to backend and wait for response from backend
      const answer = await talk_to_backend('http://localhost:5000/response',request);
      // response object to send response back to popup
      const response = {
        message: 'responsed',
        answer: answer.answer
      }
      console.log(response)
      // send the response
      send(response)
    }
  }).then(sendResponse)
  // always return true when usinf async
  return true;
});

function getYouTubeVideoId(tab) {
  const params = new URLSearchParams(new URL(tab).search);
  return params.get("v") || ""; // Extract video ID from URL parameters
}

async function talk_to_backend(url,request) {
  try {
    // fetch to the url network from backend
    const response = await fetch(url,request);
    // wait for response
    const data = await response.json()
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

