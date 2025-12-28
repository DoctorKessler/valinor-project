# Gemini content audit

Findings from a pass over the repo to surface redundancies or truncation artifacts left by prior Gemini generations.

## Redundancies
- **Duplicate Gemini client implementations:** Both `geminiService.ts` (root) and `services/geminiService.ts` defined `getFinderReaction`. The `services` copy used an older `ai.models.generateContent` signature with a raw string payload, while the root version uses `getGenerativeModel` with explicit system/user parts. The hook `usePlayerInteraction` was still importing the older copy, so the app risked invoking a half-migrated client and drifting prompts.

## Possible truncation / unfinished content
- **Archive footage branch with placeholder loop:** In `worldTruth/scenes.ts`, `BEAT_HUB_ARCHIVE_REVEAL` only offers a `WATCH_FOOTAGE` choice that loops back to `BEAT_HUB_ROOT` with a comment `// Placeholder loop for now`. There is no follow-up beat or scene to play or summarize the footage, suggesting the narrative path was cut short during generation.
