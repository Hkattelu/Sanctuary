# Research: T4_OPTIONS_STATS
## 1. Aggregating Block Stats
- Block events are logged daily in `chrome.storage.local` with keys like `stats_YYYY-MM-DD`.
- Goal: Show the last 7 days.
- Algorithm:
  - Generate the date strings for the last 7 days.
  - Call `chrome.storage.local.get(keys)`.
  - Iterate and sum the counts per domain.
  - Calculate total blocks and estimated time saved (assume 15 mins/block).

## 2. Presets & Default Schedule
- Presets: Twitter (x.com), Instagram (instagram.com), Facebook (facebook.com), TikTok (tiktok.com).
- Default Schedule: Let the user set a global default (e.g., 9-5) for new additions.
- Implementation: Save a `defaultSchedule` key in `chrome.storage.sync`.

## 3. JSON Import/Export
- Export:
  - Fetch all sync storage.
  - Convert to JSON.
  - Create a Blob and download via a temporary `<a>` tag.
- Import:
  - `<input type="file">`.
  - `FileReader` to read JSON.
  - Merge or overwrite `chrome.storage.sync`.
  - Trigger `syncRules()` automatically.

## 4. UI Polish
- Sections:
  - "Blocked Sites" (Done)
  - "Quick Add Presets"
  - "Stats Overview"
  - "Advanced" (Import/Export, Default Schedule)

Research completed.
