# Implementation Plan: T2_SCHEDULING

## Goal
Implement time-based scheduling for blocked sites, allowing users to define specific days and time ranges for each block.

## Proposed Changes

### 1. Data Model Update (`utils/storage.js`)
- Update `DEFAULT_BLOCKED_SITES` to include an optional `schedule` object:
  ```javascript
  {
    days: [1, 2, 3, 4, 5], // Mon-Fri
    startMinutes: 540,      // 9:00 AM
    endMinutes: 1020        // 5:00 PM
  }
  ```
- No changes to storage functions (`getBlockedSites`, `setBlockedSites`).

### 2. Scheduling Logic in Service Worker (`background/service-worker.js`)
- **Alarm Setup**: Create a 'checkSchedule' alarm on install (`periodInMinutes: 1`).
- **Alarm Listener**: Add `chrome.alarms.onAlarm.addListener` to call `syncRules()`.
- **Enhanced `syncRules()`**:
    - Fetch all sites.
    - Calculate current time (`currentDay`, `currentMinutes`).
    - Filter sites based on `enabled` AND `schedule` (if present).
    - If no schedule exists, assume always blocked (default).
    - If schedule exists:
        - Check if `currentDay` is in `schedule.days`.
        - Check if `currentMinutes` is between `startMinutes` and `endMinutes`.
    - Apply `declarativeNetRequest` rules as before.

### 3. Options Page UI (`options/options.html` & `options/options.js`)
- **HTML**:
    - Add a form to add a new site (domain).
    - Container for the list of currently blocked sites.
    - A template or modal for editing schedules (days, start/end time).
- **JavaScript**:
    - Load and render the list of sites.
    - Handle 'Delete' and 'Toggle' for each site.
    - Handle 'Add' for new sites.
    - Implement a simple "Schedule" editor (toggle days, set hours/minutes).
    - Save changes to `chrome.storage.sync` (which triggers `syncRules()`).

### 4. Basic Styling (`options/options.css`)
- Clean, readable list of sites.
- Visual indicators for "Currently Active" vs "Scheduled" vs "Disabled".

## Verification Plan
- **Manual Verification**:
    - Add a new site (e.g., `twitter.com`) via Options.
    - Set a schedule that includes "Now" and verify it redirects.
    - Set a schedule that excludes "Now" and verify it DOES NOT redirect.
    - Toggle a site 'Off' and verify it DOES NOT redirect.
- **Automated Verification (Console)**:
    - Run `await syncRules()` in the service worker console and verify rule counts via `chrome.declarativeNetRequest.getDynamicRules()`.

[ ] Phase 4: Implement (Mark steps as completed here)
