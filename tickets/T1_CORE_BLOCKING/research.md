# Research: T1_CORE_BLOCKING
## 1. DeclarativeNetRequest (DNR) in MV3
- MV3 requires `declarativeNetRequest` for blocking/redirecting.
- `updateDynamicRules` allows atomic updates to rules.
- Rules require unique `id` (integer).
- `priority` determines rule precedence.
- Action `redirect` requires `host_permissions` for the domains or `<all_urls>`.
- `urlFilter` is the primary way to target domains. `||domain.com^` is standard.

## 2. Manifest Requirements
- `manifest_version: 3`
- Permissions: `declarativeNetRequest`, `storage`, `alarms`, `tabs`.
- `host_permissions`: `<all_urls>` (or specific domains).
- `background.service_worker` is required for MV3.
- `declarative_net_request` block for rule resources.

## 3. UI/UX Structure
- `popup/` for quick access.
- `options/` for configuration.
- `blocked/` for the redirect target.
- `utils/` for shared storage logic.

## 4. Key Considerations
- `declarativeNetRequest` rules are persistent across sessions.
- Service workers are ephemeral; `alarms` must be used for scheduling.
- Redirection to an extension page requires `chrome-extension://[ID]/[PATH]`.

Research completed.
