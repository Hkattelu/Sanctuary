# Research: T5_STORE_PREP
## 1. Manifest Requirements for Store
- **Required Fields**: `name`, `version`, `description` (max 132 chars), `icons`.
- **Icons Sizes**: 16x16 (favicon), 32x32 (Windows Taskbar), 48x48 (Extensions page), 128x128 (Web Store).
- **Permissions Audit**:
  - `declarativeNetRequest`: Justified (Core blocking logic).
  - `storage`: Justified (Saving settings and stats).
  - `alarms`: Justified (Periodic rule sync).
  - `tabs`: Justified (Redirection logic for bypass).
  - `host_permissions`: `<all_urls>` is broad but required for site-agnostic blocking.

## 2. Privacy Policy Requirements
- **Core Principle**: Data Minimization.
- **Data Collected**: Blocked domains, schedules, and daily block counts.
- **Data Sharing**: None. All data stays within the user's Chrome profile (Sync/Local).
- **Contact**: User should provide a contact email.

## 3. Visual Assets
- **Logo Concept**: Minimalist "I" or a "Pause" icon in a calm color (e.g., Soft Teal or Gray).
- **Screenshots**:
  - 1: Blocked page with a prompt.
  - 2: Options page with the stats dashboard.
  - 3: Presets adding.

Research completed.
