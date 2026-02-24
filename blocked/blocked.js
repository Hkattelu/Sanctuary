// blocked/blocked.js

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const domain = urlParams.get('site') || 'this site';
  const siteNameEl = document.getElementById('siteName');
  const bypassBtn = document.getElementById('bypassBtn');
  const closeTabBtn = document.getElementById('closeTabBtn');
  const promptEl = document.getElementById('prompt');

  siteNameEl.textContent = domain;

  const prompts = [
    "Is this how you want to spend your time?",
    "Does this serve your higher purpose?",
    "Could you find stillness elsewhere?",
    "What are you seeking in this moment?",
    "Where is your attention needed most?",
    "Take a breath. Is this site essential right now?",
    "What if you chose a different path today?"
  ];

  // Pick a random prompt
  promptEl.textContent = prompts[Math.floor(Math.random() * prompts.length)];

  // Log the block event to background script
  chrome.runtime.sendMessage({ 
    type: 'BLOCK_EVENT', 
    domain: domain 
  });

  // Countdown for the bypass button
  let secondsLeft = 15;
  const countdownLabel = document.getElementById('countdownLabel');
  
  if (countdownLabel) {
    countdownLabel.textContent = `Awaiting stillness (${secondsLeft}s)`;
  }

  const countdown = setInterval(() => {
    secondsLeft--;
    if (secondsLeft > 0) {
      if (countdownLabel) countdownLabel.textContent = `Awaiting stillness (${secondsLeft}s)`;
    } else {
      clearInterval(countdown);
      if (countdownLabel) countdownLabel.textContent = "Ready to proceed";
      bypassBtn.disabled = false;
      bypassBtn.classList.add('ready');
    }
  }, 1000);

  bypassBtn.addEventListener('click', () => {
    // Send message to background to allow this site temporarily
    chrome.runtime.sendMessage({ 
      type: 'BYPASS_SITE', 
      domain: domain 
    }, (response) => {
      if (response && response.status === 'success') {
        // Redirect back to the original site
        window.location.href = `https://${domain}`;
      }
    });
  });

  closeTabBtn.addEventListener('click', () => {
    window.close();
  });
});
