# Implementation Plan: T5_STORE_PREP

## Goal
Finalize the extension metadata, permissions, and legal requirements for a successful Chrome Web Store submission.

## Proposed Changes

### 1. Manifest Finalization (`manifest.json`)
- **Description**: Add a concise, 132-character description: "A mindful site blocker that replaces distractions with reflection prompts and a calm pause screen. Reclaim your focus intentionally."
- **Icons**: Register icons for 16, 32, 48, and 128 pixels.
- **Versioning**: Ensure the version is set to `1.0.0`.
- **Permissions Audit**: Verify `declarativeNetRequest`, `storage`, `alarms`, and `tabs` are all strictly necessary (which they are).

### 2. Legal & Privacy (`PRIVACY.md`)
- Draft a clear Privacy Policy in the project root.
- State that:
    - No personal data is collected or transmitted.
    - Blocked domains and schedules are stored only in the user's `chrome.storage.sync` profile.
    - Block statistics are stored locally in `chrome.storage.local`.
    - No third-party tracking or analytics are used.

### 3. Visual Assets (`icons/`)
- Create a simple, minimalist SVG icon (`icon.svg`). 
- *Note*: While PNG is the standard, many modern browsers support SVG. I will provide a script/instructions to generate the PNGs from this SVG if needed, or just define the SVG in the manifest if supported (or use a placeholder). Actually, I'll provide a 128x128 SVG that the user can export.

### 4. Code Cleanup (General)
- Remove any `console.log` statements used for debugging in `service-worker.js` and `options.js` to keep the production build clean.

## Verification Plan
- **Manual Verification**:
    - Load the extension in Chrome and check the "Details" page.
    - Verify the description and version number appear correctly.
    - Open `PRIVACY.md` and ensure it's readable.
- **Validation**:
    - Use a manifest validator (internal or external) to ensure all required store keys are present.

[x] Phase 4: Implement (Mark steps as completed here)
