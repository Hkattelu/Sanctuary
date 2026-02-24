// blocked/blocked.js

const params = new URLSearchParams(window.location.search);
const site = params.get('site');
const promptElement = document.getElementById('prompt');
const siteElement = document.getElementById('siteName');
const bypassBtn = document.getElementById('bypassBtn');

const prompts = [
  { type: 'intention', text: "You were about to open Reddit. What were you actually looking for?" },
  { type: 'body', text: "Stand up. Roll your shoulders back. Take three breaths." },
  { type: 'social', text: "Who haven't you talked to in a while? Send them a message." },
  { type: 'focus', text: "What's the one thing you'd feel best about finishing today?" }
];

// 1. Log block event on load
if (site) {
  siteElement.textContent = `Mindful Pause: ${site}`;
  chrome.runtime.sendMessage({ type: 'BLOCK_EVENT', domain: site });
} else {
  siteElement.textContent = "Mindful Pause";
}

// 2. Randomly pick a prompt (and replace placeholders)
function pickPrompt() {
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  let text = prompt.text;
  if (site) {
    // Replace 'Reddit' if mentioned in prompt
    text = text.replace('Reddit', site.charAt(0).toUpperCase() + site.slice(1));
  }
  promptElement.textContent = text;
}
pickPrompt();

// 3. Countdown timer for bypass
let secondsLeft = 10;
const countdownInterval = setInterval(() => {
  secondsLeft -= 1;
  if (secondsLeft <= 0) {
    clearInterval(countdownInterval);
    bypassBtn.textContent = "I genuinely need this site";
    bypassBtn.disabled = false;
  } else {
    bypassBtn.textContent = `Wait (${secondsLeft}s)...`;
  }
}, 1000);

// 4. Handle bypass action
bypassBtn.addEventListener('click', () => {
  if (site) {
    chrome.runtime.sendMessage({ type: 'BYPASS_SITE', domain: site }, (response) => {
      // Redirect back to the site once the bypass rule is confirmed
      window.location.href = `https://${site}`;
    });
  }
});
