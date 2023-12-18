console.log("hello")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "get-answer"){
        sendResponse("get-question")
    }
});