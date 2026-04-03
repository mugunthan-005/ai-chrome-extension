document.addEventListener('DOMContentLoaded', () => {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const responseBox = document.getElementById('responseBox');

  summarizeBtn.addEventListener('click', async () => {
    responseBox.textContent = 'Fetching page text...';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab found.');

      chrome.tabs.sendMessage(tab.id, { action: 'getPageText' }, (response) => {
        if (chrome.runtime.lastError) {
          responseBox.textContent = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }

        if (!response?.text) {
          responseBox.textContent = 'No response text from content script.';
          return;
        }

        responseBox.textContent = response.text.substring(0, 200) + '...';
        console.log('Received page text from content script:', response.text);
      });
    } catch (err) {
      responseBox.textContent = 'Exception: ' + err.message;
    }
  });
});
