// Listen for messages from the popup
/// <reference types="chrome"/>

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePage") {
    const title = document.title;
    const url = window.location.href;
    const h1 = document.querySelector('h1')?.textContent || title;
    
    sendResponse({
      title: h1,
      url: url
    });
  }
  return true;
});

export {};
