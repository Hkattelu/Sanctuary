# Research: T3_BLOCKED_PAGE_POLISH
## 1. Design & Aesthetic
- Goal: Calm, journal-like, minimalist.
- CSS:
  - Background: Soft, warm gray or off-white (`#fcfcfc`).
  - Font: Clean sans-serif, high line-height.
  - Centering: Flexbox or Grid.
  - Transitions: Smooth opacity changes.

## 2. Prompt Logic
- Categories: Intention, Body, Social, Focus.
- Implementation:
  ```javascript
  const prompts = [
    { type: 'intention', text: "You were about to open Reddit. What were you actually looking for?" },
    { type: 'body', text: "Stand up. Roll your shoulders back. Take three breaths." },
    { type: 'social', text: "Who haven't you talked to in a while? Send them a message." },
    { type: 'focus', text: "What's the one thing you'd feel best about finishing today?" }
  ];
  // Select randomly on load.
  ```

## 3. Bypass Mechanic (Countdown)
- Button that stays disabled for 10 seconds.
- Update text every second: "Wait (10s)..." -> "I genuinely need this site".
- When timer hits 0, enable the button.
- Action: Redirect to the original URL (using `chrome.tabs.update` or just `window.location.href`).
- Note: If we redirect to the site *after* it's blocked, it will just block again *unless* we implement a temporary bypass or "allow list" for that session. However, the plan says "redirect to the site". I'll need to think about how to bypass the blocker rule temporarily.
- Strategy for bypass: Use `chrome.declarativeNetRequest.updateDynamicRules` to add an "allow" rule with higher priority for a specific domain for a short time (e.g., 15 mins).

## 4. Stats Integration
- Send `BLOCK_EVENT` via `chrome.runtime.sendMessage`.
- The service worker listens for this and increments counts in `chrome.storage.local`.

Research completed.
