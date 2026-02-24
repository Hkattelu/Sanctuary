# Implementation Plan: T1_CORE_BLOCKING

## Goal
Establish the foundational structure of the "Intentional" extension, including the manifest, service worker for blocking, and the redirect target page.

## Proposed Changes

### 1. Directory Structure
Create the following folders within `blocker/`:
- `background/`
- `blocked/`
- `popup/`
- `options/`
- `utils/`
- `icons/`

### 2. Manifest Setup (`manifest.json`)
- Define MV3.
- Set permissions: `declarativeNetRequest`, `storage`, `alarms`, `tabs`.
- Set host permissions: `<all_urls>`.
- Register `background/service-worker.js`.
- Define `action` for `popup/popup.html`.
- Define `options_page` as `options/options.html`.

### 3. Core Storage Utility (`utils/storage.js`)
- Create constants for default blocked sites (Reddit, LinkedIn).
- Provide functions to get/set blocked sites using `chrome.storage.sync`.

### 4. Service Worker (`background/service-worker.js`)
- On installation (`onInstalled`), seed the default blocked sites if empty.
- Implement `syncRules()` to:
    - Fetch blocked sites from storage.
    - Generate `declarativeNetRequest` rules (IDs 10, 20, etc.).
    - Use `updateDynamicRules` to apply them.
- Call `syncRules()` on startup and storage changes.

### 5. Blocked Page (`blocked/blocked.html` & `.js`)
- Basic layout with a "Pause" header.
- JavaScript to extract the blocked domain from the URL parameter.
- Display a simple reflection prompt.

## Verification Plan
- **Manual Loading**: Load the `blocker` folder as an unpacked extension in Chrome.
- **Rule Verification**: Check `chrome.declarativeNetRequest.getDynamicRules()` in the service worker console to ensure rules are generated for reddit.com and linkedin.com.
- **Redirection Test**: Attempt to visit `reddit.com` and verify it redirects to `chrome-extension://.../blocked/blocked.html`.
- **Storage Test**: Verify default sites are seeded correctly on first install.

[x] Phase 4: Implement (Mark steps as completed here)
