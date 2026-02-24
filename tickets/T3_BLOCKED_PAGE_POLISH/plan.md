# Implementation Plan: T3_BLOCKED_PAGE_POLISH

## Goal
Transform the blocked page into a mindful interstitial with prompts, a calm aesthetic, and a high-friction bypass mechanic.

## Proposed Changes

### 1. Blocked Page UI/UX (`blocked/blocked.html`, `blocked/blocked.css`)
- **HTML**:
    - Add a `main` container for the prompt.
    - Add a section for the countdown timer and bypass button.
    - Use a clean, minimalist structure.
- **CSS**:
    - Use soft colors (off-white background, dark gray text).
    - Centered layout with plenty of white space.
    - Large, elegant typography.
    - Smooth fade-in animation for the content.

### 2. Blocked Page Logic (`blocked/blocked.js`)
- **Prompts**: Implement an array of prompts categorized by "Intention", "Body", "Social", and "Focus". Pick one randomly on load.
- **Countdown**:
    - Start a 10-second timer when the page loads.
    - Update a "Bypass" button's label with the remaining seconds.
    - Enable the button only when the timer reaches zero.
- **Bypass Action**:
    - When clicked, send a message to the service worker: `{ type: 'BYPASS_SITE', domain: site }`.
    - Then, redirect the user back to `https://[site]`.
- **Event Logging**: Send a message on load: `{ type: 'BLOCK_EVENT', domain: site }`.

### 3. Service Worker Updates (`background/service-worker.js`)
- **Event Listener**: Add `chrome.runtime.onMessage.addListener` to handle:
    - `BLOCK_EVENT`: Increment a counter in `chrome.storage.local` (e.g., `stats.totalBlocks`).
    - `BYPASS_SITE`:
        - Generate a unique high-priority rule (ID 1000+) to `allow` the specific domain.
        - Set a timer (using `chrome.alarms`) to remove this rule after 15 minutes.
        - *Self-correction*: DNR rules are persistent, so we MUST remember to remove the bypass rule later.

## Verification Plan
- **Manual Verification**:
    - Visit a blocked site (e.g., `reddit.com`).
    - Verify the calm design and random prompt.
    - Verify the "Bypass" button is disabled and counting down.
    - Click "Bypass" after 10s and verify it redirects and stays unblocked for 15 mins.
    - Verify `chrome.storage.local` contains the updated block count.

[x] Phase 4: Implement (Mark steps as completed here)
