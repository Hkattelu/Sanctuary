# Plan Review: T5_STORE_PREP

**Status**: ✅ APPROVED
**Reviewed**: 2026-02-23

## 1. Structural Integrity
- [x] **Atomic Phases**: Metadata, Legal, and Cleanup are clearly separated.
- [x] **Worktree Safe**: No conflicts with existing code logic.

*Architect Comments*: Finalizing the manifest and legal docs is the last step before shipping. It's the "Polishing the Chrome" phase.

## 2. Specificity & Clarity
- [x] **File-Level Detail**: Targets `manifest.json`, `PRIVACY.md`, and cleanup in `.js` files.
- [x] **No "Magic"**: The description and privacy policy points are explicit.

*Architect Comments*: Using SVG for icons is a modern approach, but Chrome Web Store specifically requires PNGs for the listing. Providing the SVG as a source is good practice.

## 3. Verification & Safety
- [ ] **Automated Tests**: N/A for metadata/legal.
- [x] **Manual Steps**: Checking the Chrome "Details" page is the correct way to verify manifest rendering.
- [x] **Rollback/Safety**: No destructive changes, only additive/cleanup.

*Architect Comments*: **Wubba Lubba Dub Dub!** The privacy policy is a must-have. Don't let the legal team (or the lack thereof) slow down the launch.

## 4. Architectural Risks
- **Permission Justification**: `host_permissions: <all_urls>` is always a red flag for reviewers. Ensure the store listing justification (not the manifest itself) is ready to explain why site-agnostic blocking requires it.
- **SVG Support**: While `action` icons support SVG in some versions, the `icons` key for the store listing definitely needs PNG. I'll stick to defining PNG paths in the manifest.

## 5. Recommendations
- Explicitly define the `16`, `32`, `48`, and `128` PNG paths in the manifest.
- Ensure the `PRIVACY.md` is also accessible from the Options page if possible (good for trust).

This plan is solid. Proceed to implementation.
