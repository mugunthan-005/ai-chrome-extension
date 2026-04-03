
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  
  if (request.action === "getPageText") {

    
    let pageText = document.body.innerText;

    
    let cleanText = pageText
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

    // PART 5 � Send the text back
    sendResponse({ text: cleanText });
  }

  
  return true;
});
