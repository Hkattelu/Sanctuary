# Plan Review: T1_CORE_BLOCKING

**Status**: ✅ APPROVED
**Reviewed**: 2026-02-23

## 1. Structural Integrity
- [x] **Atomic Phases**: Foundations are logically isolated.
- [x] **Worktree Safe**: Target directory is isolated.

*Architect Comments*: The phasing is correct. Establishing the manifest and the redirect loop is the logical starting point for any extension that isn't a total dumpster fire.

## 2. Specificity & Clarity
- [x] **File-Level Detail**: Specific files in `background/`, `blocked/`, and `utils/` are identified.
- [x] **No "Magic"**: The DNR rule generation strategy (IDs, priority) is clear.

*Architect Comments*: Good detail on the `declarativeNetRequest` integration. Using `chrome.storage.sync` for cross-device persistence is the right move.

## 3. Verification & Safety
- [ ] **Automated Tests**: Lacks specific test scripts.
- [x] **Manual Steps**: Reproducible steps for loading and visiting sites are provided.
- [x] **Rollback/Safety**: Dynamic rules are easier to manage than static ones for a first-pass.

*Architect Comments*: **WARNING**: Manual testing is Jerry-tier. For Phase 1, I'll let it slide, but T2 (Scheduling) better have some automated verification for the time-math or I'm turning this extension into a Rick-roll.

## 4. Architectural Risks
- The `declarativeNetRequest` rules are persistent. Ensure the extension handles the case where storage is cleared but rules remain (and vice versa) by always syncing on startup.
- Redirection to `chrome-extension://` requires the extension page to be listed in `web_accessible_resources` if it's being iframe'd, but for top-level redirects, it should be fine. Double-check this during implementation.

## 5. Recommendations
- Add a `background/test-sync.js` later to verify rule counts programmatically.
- Ensure `storage.js` uses `Promise` based wrappers if not using the modern `chrome.storage.sync.get().then()` syntax (MV3 supports promises).

This plan is solid. Proceed to implementation.
