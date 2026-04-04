// ================================
// CHUNK 1 — Grab HTML elements
// ================================
const summarizeBtn = document.getElementById('summarizeBtn');
const askBtn = document.getElementById('askBtn');
const userInput = document.getElementById('userInput');
const responseBox = document.getElementById('responseBox');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const keyStatus = document.getElementById('keyStatus');


// ================================
// CHUNK 2 — Helper functions
// ================================
function showResponse(text) {
  responseBox.innerHTML = `<p>${text}</p>`;
}

function showLoading() {
  responseBox.innerHTML = `<p class="placeholder-text">🤖 Thinking...</p>`;
}

function showError(message) {
  responseBox.innerHTML = `<p style="color: #f87171;">${message}</p>`;
}


// ================================
// CHUNK 3 — API Key saving & loading
// ================================

// When popup opens → load saved key from Chrome storage
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['geminiApiKey'], function(result) {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
      keyStatus.textContent = '✅ Key saved!';
      keyStatus.className = 'key-status key-saved';
    } else {
      keyStatus.textContent = '⚠️ No key saved yet';
      keyStatus.className = 'key-status key-missing';
    }
  });
});

// When Save Key button clicked → save to Chrome storage
saveKeyBtn.addEventListener('click', function() {
  const key = apiKeyInput.value.trim();

  if (!key) {
    keyStatus.textContent = '❌ Please paste your API key first!';
    keyStatus.className = 'key-status key-missing';
    return;
  }

  chrome.storage.local.set({ geminiApiKey: key }, function() {
    keyStatus.textContent = '✅ Key saved successfully!';
    keyStatus.className = 'key-status key-saved';
  });
});

// Helper to get the saved key
function getApiKey() {
  return new Promise(function(resolve) {
    chrome.storage.local.get(['geminiApiKey'], function(result) {
      resolve(result.geminiApiKey || null);
    });
  });
}


// ================================
// CHUNK 4 — Call Gemini AI
// ================================
async function callGemini(prompt) {
  const API_KEY = await getApiKey();

  if (!API_KEY) {
    throw new Error("No API key found! Please save your Gemini API key first.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.candidates[0].content.parts[0].text;
}


// ================================
// CHUNK 5 — Summarize button
// ================================
summarizeBtn.addEventListener('click', async function() {
  showLoading();

  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getPageText" }, async function(response) {

      if (!response || !response.text) {
        showError("❌ Could not get page text. Try refreshing the page!");
        return;
      }

      const prompt = `Please summarize the following webpage content in simple, clear bullet points:\n\n${response.text}`;

      try {
        const result = await callGemini(prompt);
        showResponse(result);
      } catch (error) {
        showError("❌ Error: " + error.message);
      }
    });
  });
});


// ================================
// CHUNK 6 — Ask button
// ================================
askBtn.addEventListener('click', async function() {
  const question = userInput.value.trim();

  if (!question) {
    showError("⚠️ Please type a question first!");
    return;
  }

  showLoading();

  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getPageText" }, async function(response) {

      if (!response || !response.text) {
        showError("❌ Could not get page text. Try refreshing the page!");
        return;
      }

      const prompt = `Based on the following webpage content, answer this question: "${question}"\n\nWebpage content:\n${response.text}`;

      try {
        const result = await callGemini(prompt);
        showResponse(result);
      } catch (error) {
        showError("❌ Error: " + error.message);
      }
    });
  });
});