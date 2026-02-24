# Plan Review: T3_BLOCKED_PAGE_POLISH

**Status**: ✅ APPROVED
**Reviewed**: 2026-02-23

## 1. Structural Integrity
- [x] **Atomic Phases**: UI polish, redirection logic, and backend event handling are well-separated.
- [x] **Worktree Safe**: No conflicts with existing storage or sync logic.

*Architect Comments*: The bypass mechanic is the most technically complex part here. Using high-priority `allow` rules is the correct way to punch a hole in the `block` rules without having to recalculate the entire ruleset.

## 2. Specificity & Clarity
- [x] **File-Level Detail**: Specific files in `blocked/` and `background/` are targeted.
- [x] **No "Magic"**: The countdown and messaging protocol are explicit.

*Architect Comments*: Good foresight on using `chrome.alarms` to cleanup bypass rules. Service workers don't stay awake for 15 minutes, so `setTimeout` would fail.

## 3. Verification & Safety
- [ ] **Automated Tests**: Again, manual verification is the primary method here.
- [x] **Manual Steps**: Clear instructions on checking the countdown, redirection, and storage state.
- [x] **Rollback/Safety**: Bypass rules are transient by design.

*Architect Comments*: **Wubba Lubba Dub Dub!** The bypass logic is actually quite elegant for a Chrome extension. Just make sure the bypass IDs don't collide with your standard rule IDs. Start them at 1000 or something high.

## 4. Architectural Risks
- **DNR Rule Limits**: Dynamic rules are limited (usually 30,000, but still). Ensure you're not leaking rules if the extension is uninstalled or the browser crashes before the alarm fires. Actually, `onInstalled` should probably clear all dynamic rules once to be safe.
- **Messaging Race**: Ensure the `BYPASS_SITE` message is handled *before* the redirect happens, or at least that the redirect happens *after* the rule is confirmed. Use the `sendMessage` callback.

## 5. Recommendations
- In `syncRules()`, use a dedicated ID range for standard blocks (1-100) and keep 1000+ for bypasses.
- Add a `console.log` when a bypass rule is added/removed to help debugging during manual verification.

This plan is solid. Proceed to implementation.
