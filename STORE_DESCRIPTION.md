# Sanctuary — Chrome Web Store Copy (All Fields)

---

## FIELD: Name (30 chars max)
```
Sanctuary
```

---

## FIELD: Short Summary (132 chars max — shown in search results)
```
A mindful website blocker that turns distraction into reflection. Block sites, breathe, and reclaim your focus — intentionally.
```
*(127 characters)*

---

## FIELD: Full Description

Paste everything between the triple-backtick fences below, verbatim.

```
You didn't mean to open Instagram. Again.

Sanctuary is a website blocker built for people who want more than just a wall. Instead of a blunt "site blocked" error, Sanctuary meets you with a breathing exercise, a quiet reflection prompt, and a genuine pause — so you can decide, with intention, whether you actually want to be there.

━━━━━━━━━━━━━━━━━━━━━━━━━
HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━

You visit a site on your block list. Sanctuary intercepts the page and shows you a calm, beautiful screen with a single question — "Is this how you want to spend your time?" or "What are you seeking in this moment?" — alongside a gentle breathing animation.

After 15 seconds of stillness, you have two choices:

→ Return to Stillness: close the tab and get back to what matters.
→ Continue: proceed with intention, knowing the site will re-block itself after a short window.

It's not about restriction. It's about the pause between impulse and action.

━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━

🌿 Mindful blocked page — a breathing orb and reflection prompt instead of a jarring error screen
⏱ 15-second pause with progress feedback before bypass unlocks
🔁 Automatic re-blocking after a configurable bypass window (default: 15 minutes)
📅 Per-site scheduling — block by day of week and time range (e.g. Mon–Fri, 9am–6pm)
📊 Focus dashboard — see your "Life Reclaimed" in minutes, your total pauses, and your top distraction
🪨 The Cairn — a growing stack of stones in your dashboard that builds with every focus win
⚡ One-click presets for X (Twitter), Instagram, Facebook, TikTok, and YouTube
💾 Import / Export — back up your entire block list as JSON and restore it on any device
🎛 Fully customizable — set a default schedule for all new sites and a per-site bypass duration

━━━━━━━━━━━━━━━━━━━━━━━━━
WHO IT'S FOR
━━━━━━━━━━━━━━━━━━━━━━━━━

Sanctuary is for people who've tried blockers before and found them too blunt, too easy to disable, or too punishing. It's especially useful if you:

• Struggle with doomscrolling or social media addiction
• Are working on ADHD or anxiety-related impulse control
• Practice mindfulness and want your tools to reflect that
• Want to do deep work, focus sessions, or distraction-free writing
• Are building a healthier relationship with screen time

━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR PRIVACY — WE MEAN IT
━━━━━━━━━━━━━━━━━━━━━━━━━

Sanctuary was built with a simple principle: your data belongs to you.

• No accounts. No email required. No sign-ups.
• Your block list syncs privately across Chrome devices through your own Google profile. We never see it.
• Your focus stats (how many times you paused reddit.com today) stay on your device and never leave.
• Zero analytics. Zero ad trackers. Zero third-party scripts of any kind.

That's it. No asterisks.

━━━━━━━━━━━━━━━━━━━━━━━━━
FREE & OPEN SOURCE
━━━━━━━━━━━━━━━━━━━━━━━━━

Sanctuary is completely free. No premium tier. No feature gates. No subscriptions.

If it helps you reclaim even one hour of focus per week, consider supporting the project with a small donation — there's a link on the pause screen itself. Every contribution keeps this tool independent and ad-free.

━━━━━━━━━━━━━━━━━━━━━━━━━

"Quiet the mind, and the soul will speak."

Start your first session. See what you build with the time you get back.
```

---

## FIELD: Category
```
Productivity
```

---

## FIELD: Language
```
English
```

---

## PRIVACY TAB — Data usage declaration

**Select:** "This extension does not collect or use user data"

Then for each permission, use the justifications below.

---

## PRIVACY TAB — Permission justifications (one per field)

**declarativeNetRequest**
```
Used to redirect navigation from blocked websites to Sanctuary's pause screen. This permission does not read page content — it only intercepts top-level navigation to URLs the user has explicitly added to their block list.
```

**storage**
```
Used to save the user's block list and custom schedules to chrome.storage.sync (synced privately across the user's own Chrome devices via their Google account) and to store daily focus statistics in chrome.storage.local (which never leaves the device).
```

**alarms**
```
Used to run a once-per-minute heartbeat that checks whether a scheduled block is currently active, and to set a countdown timer that automatically re-blocks a site after the user's chosen bypass window expires.
```

**tabs**
```
Used to detect the active tab during the bypass flow, enabling the extension to redirect the user back to the site they chose to visit after granting themselves temporary access.
```

**host_permissions: <all_urls>**
```
Required because Sanctuary allows users to block any domain they choose. Since the list of blocked sites is user-defined and site-agnostic, the extension cannot know in advance which URLs to intercept. No page content is read at any URL.
```

---

## SCREENSHOTS — Recommended sequence

1. **The Pause Screen** (most important — show the breathing orb, a reflection prompt, and the two action buttons on the warm stone background)
2. **The Options Dashboard** (show the Cairn, "Life Reclaimed" stat, and the block list with active indicators)
3. **Adding a Site / Scheduling** (show the schedule editor open on a site entry)

Resolution: 1280×800 PNG preferred.

---

## STORE LISTING LAUNCH CHECKLIST

- [ ] Name: `Sanctuary`
- [ ] Short summary: copied from above *(check char count before pasting)*
- [ ] Full description: copied from above
- [ ] Category: `Productivity`
- [ ] Language: `English`
- [ ] Icon uploaded: 128×128 PNG *(export `icons/icon.svg` → PNG first)*
- [ ] At least 1 screenshot at 1280×800 or 640×400
- [ ] Privacy tab → data collection: **Does not collect user data**
- [ ] Privacy tab → all 5 permission justifications filled in
- [ ] Distribution: Public
- [ ] Regions: All regions
- [ ] `PRIVACY.md` title updated from "Intentional" → "Sanctuary"
- [ ] `manifest.json` icon paths updated to PNG filenames
