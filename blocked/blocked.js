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

  // --- DELIGHT: Site-Specific Context ---
  const siteConfig = {
    'reddit.com': {
      theme: 'theme-reddit',
      prompt: "The rabbit hole is endless.\nYou are not.",
      closeBtnText: "Escape the Hivemind",
      subText: "Close this tab"
    },
    'linkedin.com': {
      theme: 'theme-linkedin',
      prompt: "Comparison is the thief of joy.\nFocus on your own path.",
      closeBtnText: "Disconnect & Create",
      subText: "Close this tab"
    },
    'twitter.com': {
      theme: 'theme-reddit',
      prompt: "Don't let the noise drown out your own voice.",
      closeBtnText: "Silence the Noise",
      subText: "Close this tab"
    },
    'x.com': {
      theme: 'theme-reddit',
      prompt: "Don't let the noise drown out your own voice.",
      closeBtnText: "Silence the Noise",
      subText: "Close this tab"
    },
    'instagram.com': {
      theme: 'theme-instagram',
      prompt: "Real life is happening right here, right now.\nNot in the feed.",
      closeBtnText: "Be Present",
      subText: "Close this tab"
    },
    'youtube.com': {
      theme: 'theme-youtube',
      prompt: "One video turns into ten.\nIs this what you came for?",
      closeBtnText: "Break the Loop",
      subText: "Close this tab"
    },
    'tiktok.com': {
      theme: 'theme-tiktok',
      prompt: "Seconds turn into hours.\nReclaim your time.",
      closeBtnText: "Stop Scrolling",
      subText: "Close this tab"
    }
  };

  // Check for exact match or domain containment
  let activeConfig = null;
  // Iterate keys to find a match (e.g. 'old.reddit.com' includes 'reddit.com')
  for (const key of Object.keys(siteConfig)) {
    if (domain.includes(key)) {
      activeConfig = siteConfig[key];
      break;
    }
  }

  if (activeConfig) {
    // Apply Theme
    document.body.classList.add(activeConfig.theme);
    
    // Set Custom Content
    promptEl.innerText = activeConfig.prompt;
    document.title = activeConfig.closeBtnText; // Update tab title for delight
    
    // Update Close Button safely
    closeTabBtn.innerHTML = `
      ${activeConfig.closeBtnText}
      <span class="btn-sub">${activeConfig.subText}</span>
    `;
  } else {
    // Fallback to random generic prompt
    promptEl.textContent = prompts[Math.floor(Math.random() * prompts.length)];
    document.title = "Sanctuary";
  }
  
  // Log the block event to background script
  chrome.runtime.sendMessage({ 
    type: 'BLOCK_EVENT', 
    domain: domain 
  });

  // Countdown for the bypass button
  const TOTAL_SECONDS = 15;
  let secondsLeft = TOTAL_SECONDS;
  const countdownLabel = document.getElementById('countdownLabel');
  
  // Initialize progress
  bypassBtn.style.setProperty('--progress', '0%');
  
  if (countdownLabel) {
    countdownLabel.textContent = `Awaiting stillness (${secondsLeft}s)`;
  }

  const countdown = setInterval(() => {
    secondsLeft--;
    
    // Calculate progress percentage
    const progress = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;
    bypassBtn.style.setProperty('--progress', `${progress}%`);
    
    if (secondsLeft > 0) {
      if (countdownLabel) countdownLabel.textContent = `Awaiting stillness (${secondsLeft}s)`;
    } else {
      clearInterval(countdown);
      if (countdownLabel) countdownLabel.textContent = "Proceed with intention";
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
