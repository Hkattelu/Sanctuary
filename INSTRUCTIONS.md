# Sanctuary Chrome Store Release Instructions

## 1. Preparation
Before uploading, ensure you have the following assets ready:
*   **Source Code Zip:** `sanctuary.zip` (included in this bundle).
*   **Store Description:** Use the text in `STORE_DESCRIPTION.md`.
*   **Screenshots:** Take at least 1 screenshot of the extension in action (e.g., the blocked page).
    *   Resolution: 1280x800 or 640x400 (pixels).
    *   Format: PNG or JPEG.
*   **Icon:** You need a 128x128px PNG icon.
    *   *Note:* The extension package uses an SVG icon, which works great in the browser. However, the store listing *requires* a PNG upload. You can convert `icons/icon.svg` to PNG using an online converter or image editor.

## 2. Developer Dashboard
1.  Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard).
2.  Sign in with your Google account.
3.  Click **"Add new item"**.
4.  Upload the `sanctuary.zip` file.

## 3. Store Listing Details
*   **Title:** Sanctuary
*   **Summary:** A mindful site blocker that replaces distractions with reflection prompts and a calm pause screen.
*   **Description:** Copy and paste the contents of `STORE_DESCRIPTION.md`.
*   **Category:** Productivity / Mindfulness (or just Productivity).
*   **Language:** English.

## 4. Privacy Practices
The Chrome Web Store requires you to declare privacy practices.
*   **Data Usage:** Since Sanctuary stores data locally (`chrome.storage.local`) and doesn't send it to a server, you can declare that you **do not collect user data**.
*   **Permissions justification:**
    *   `declarativeNetRequest`: Used to block navigation to specified websites.
    *   `storage`: Used to save the list of blocked sites locally on the user's device.
    *   `alarms`: Used for scheduling mindful reminders or resets (if applicable).
    *   `tabs`: Used to detect active tabs for blocking logic.

## 5. Payments & Distribution
*   **Distribution:** Public.
*   **Regions:** All regions.

## 6. Publish
Once all fields are filled and assets uploaded, click **"Submit for Review"**. Reviews typically take 24-48 hours but can take longer for first-time developers.

## Tips for Success 🚀
*   **Screenshots Matter:** The first thing users see is your screenshot. Make sure it shows the beautiful "Blocked" page with the breathing orb.
*   **Keywords:** Use terms like "mindful browsing", "focus", "ADHD tool", "website blocker", "digital wellbeing" in your description naturally.
*   **Reviews:** Ask friends to try it out and leave a 5-star review. Initial momentum is crucial.
*   **Donation Visibility:** The link is now on the blocked page and in the store description. Mention it in your personal socials when you launch!

Good luck with the launch! 🌿
