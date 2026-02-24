# Research: T2_SCHEDULING
## 1. Chrome Alarms for Background Sync
- `chrome.alarms` can schedule code execution periodically.
- Essential for MV3 service workers since they can be suspended.
- `chrome.alarms.create()` establishes the schedule.
- `chrome.alarms.onAlarm.addListener()` handles the trigger.
- Minimum interval: 1 minute (usually, though docs mention 0.5 in newer Chrome). For site blocking, 1 minute is standard for "heartbeat" checks.

## 2. Scheduling Logic (Current Time vs. Rules)
- The logic needs to determine "Should this site be blocked *right now*?".
- Input: `blockedSites` data model (days of week, start/end minutes).
- Date calculation:
  ```javascript
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDay = now.getDay(); // 0-6 (Sun-Sat)
  ```
- Comparison:
  - Check if `site.enabled` is true.
  - Check if today is in `site.schedule.days`.
  - Check if `currentMinutes` is within `[site.schedule.startMinutes, site.schedule.endMinutes]`.

## 3. Options Page: Schedule Editing
- Requires a way to manage schedules for each site.
- UI elements: checkboxes for days, time input for start/end.
- JavaScript to:
  - Load sites from storage.
  - Render a list of sites with toggles and edit buttons.
  - Handle form submission for new/edited schedules.

## 4. Constraints & Considerations
- Alarms are not "exact" to the second (for battery saving).
- If a user changes their system time, the extension might need to re-sync.
- The service worker must call `syncRules()` on:
  - `onAlarm` (heartbeat).
  - `onInstalled` (setup).
  - `storage.onChanged` (immediate effect when settings change).

Research completed.
