# AI Chrome Extension

AI-powered Chrome extension to summarize and chat with web pages using Anthropic's Claude.

## Features

- **Summarize Pages**: Get concise summaries of any webpage content
- **Chat with Pages**: Ask questions about the content of the current webpage
- **Secure API Key Storage**: Your Claude API key is stored locally in Chrome storage

## Setup

1. Get your Anthropic API key from [Anthropic Console](https://console.anthropic.com/)
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select this folder
3. Click the extension icon, enter your API key, and save it
4. Navigate to any webpage and use the extension

## Usage

- Click the extension icon on any webpage
- Enter your Claude API key if not already set
- Click "Summarize This Page" for a quick summary
- Or type a question in the chat box and click "Ask"

## Files

- `manifest.json`: Extension configuration
- `popup.html`: Extension popup UI
- `popup.js`: Main logic for API calls and interactions
- `popup.css`: Styling for the popup
- `content.js`: Extracts text from web pages
- `background.js`: Service worker (currently unused)
- `icons/`: Folder for extension icons (add your own PNG files)

## Permissions

- `activeTab`: Access the current tab
- `scripting`: Inject content scripts
- `storage`: Store API key
- `https://api.anthropic.com/*`: Call Claude API
