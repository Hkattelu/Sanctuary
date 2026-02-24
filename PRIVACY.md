# Privacy Policy for Intentional

**Effective Date:** February 23, 2026

Intentional is a browser extension designed to help you reclaim your focus by mindfully blocking distracting websites. We take your privacy seriously.

## 1. Data Collection and Usage
Intentional is built on the principle of **Data Minimization**. 
- **Personal Data:** We do NOT collect, store, or transmit any personal identification information (PII), such as your name, email address, or browsing history.
- **Extension Settings:** Your list of blocked domains and custom schedules are stored exclusively in your browser's `chrome.storage.sync` profile. This allows your settings to roam across your Chrome devices if you are signed in, but this data is managed by Google and is not accessible to us.
- **Usage Statistics:** Local block counts (e.g., how many times "reddit.com" was blocked today) are stored exclusively in your browser's `chrome.storage.local`. This data never leaves your device and is used only to display your personal "Time Saved" dashboard.

## 2. Data Sharing
We do NOT share, sell, or trade your data with any third parties. There are no analytics trackers or advertising scripts embedded in Intentional.

## 3. Permissions Justification
- `declarativeNetRequest`: Required to perform the core function of redirecting distracting sites to a pause screen without reading your page content.
- `storage`: Required to save your block lists and progress.
- `alarms`: Required to periodically check and sync your schedules.
- `tabs`: Required to allow you to bypass a block when you genuinely need to access a site.
- `host_permissions` (<all_urls>): Required so the extension can block any domain you choose to add to your list.

## 4. Contact
If you have any questions about this Privacy Policy, please contact the developer via the Chrome Web Store support page.
