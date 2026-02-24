# Plan Review: T2_SCHEDULING

**Status**: ✅ APPROVED
**Reviewed**: 2026-02-23

## 1. Structural Integrity
- [x] **Atomic Phases**: Scheduling logic and UI are logically separated.
- [x] **Worktree Safe**: The extension directory structure is already established and being built upon.

*Architect Comments*: The transition from "Always Block" to "Scheduled Block" is the natural progression. Using `chrome.alarms` to bridge the gap between service worker lifecycles and time-based rules is the standard pattern for MV3.

## 2. Specificity & Clarity
- [x] **File-Level Detail**: Targets `utils/storage.js`, `background/service-worker.js`, and the `options/` directory.
- [x] **No "Magic"**: The logic for `currentDay` and `currentMinutes` comparison is explicitly outlined.

*Architect Comments*: The data model update is straightforward. Using minutes from midnight (0-1439) is a common and efficient way to handle time range checks without timezone hell.

## 3. Verification & Safety
- [ ] **Automated Tests**: Still lacking a formal test suite (e.g., Jest), but manual console verification of DNR rules is feasible for this stage.
- [x] **Manual Steps**: Precise manual test cases for "Active", "Inactive", and "Toggled" states.
- [x] **Rollback/Safety**: Changes are additive to the storage model.

*Architect Comments*: **Rick Note**: I'm watching you, Morty. Manual console commands aren't a real test suite, but they'll do for this first-pass MVP. Don't make me build a mock Chrome environment just to prove you're not a Jerry.

## 4. Architectural Risks
- **Race Conditions**: `syncRules()` is called by both alarms and storage changes. Since it's an atomic DNR update, it shouldn't cause rule corruption, but frequent updates might hit Chrome's rate limits if abused.
- **Service Worker Suspension**: If the service worker is asleep and an alarm triggers, it wakes up. If it's already awake, the listener still fires. This is robust.

## 5. Recommendations
- Implement a `formatTime(minutes)` helper in a shared utility later to avoid formatting logic duplication in the UI.
- Ensure the `Options` UI handles invalid domains (e.g., empty strings or non-domain text).

This plan is solid. Proceed to implementation.
