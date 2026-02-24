# Implementation Plan: T4_OPTIONS_STATS

## Goal
Enhance the Options page with data-driven insights (stats), one-click presets for common distractions, and advanced settings like JSON import/export and default schedules.

## Proposed Changes

### 1. Stats Aggregation Logic (`options/options.js`)
- **Helper function**: `getWeeklyStats()`
    - Generate keys for the last 7 days (`stats_YYYY-MM-DD`).
    - Fetch from `chrome.storage.local`.
    - Aggregate total blocks and per-site counts.
- **UI Update**: Add a "Stats" section to the Options page showing:
    - Total blocks this week.
    - Estimated time saved (blocks * 15 min).
    - Top 3 most blocked sites.

### 2. Presets UI (`options/options.html`, `options/options.js`)
- **HTML**: Add a "Presets" section with buttons for:
    - Twitter/X (`x.com`)
    - Instagram (`instagram.com`)
    - Facebook (`facebook.com`)
    - TikTok (`tiktok.com`)
- **JavaScript**:
    - Add a `addPreset(domain)` function.
    - Check if the domain is already blocked before adding.
    - Apply the `defaultSchedule` (if set).

### 3. Advanced Settings (`options/options.html`, `options/options.js`)
- **Default Schedule**:
    - Add UI to set a global "Default Schedule" (days + time range).
    - Store in `chrome.storage.sync.get('defaultSchedule')`.
- **Import/Export**:
    - **Export**: Button to stringify `blockedSites` and `defaultSchedule` to a `.json` file.
    - **Import**: File input that parses JSON and updates `chrome.storage.sync`.
    - **UI Warning**: Add a confirmation before overwriting existing sites on import.

### 4. Style Enhancements (`options/options.css`)
- Use a "Bento-style" grid or clearly separated cards for each section (Stats, Sites, Presets, Advanced).
- Improve visual hierarchy for the stats dashboard.

## Verification Plan
- **Manual Verification**:
    - **Stats**: Visit a blocked site several times, wait a minute for sync/logging, and verify the count increases in Options.
    - **Presets**: Click "Add Twitter" and verify it appears in the list with the correct domain and default schedule.
    - **Export**: Export settings, delete a site, then import the file and verify the site is restored.
    - **Default Schedule**: Change default to 10 AM - 4 PM, add a new site, and verify it inherits this schedule.

[x] Phase 4: Implement (Mark steps as completed here)
