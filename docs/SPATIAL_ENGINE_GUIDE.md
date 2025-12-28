# Spatial engine + Alex silhouette quickstart

This repo already ships a full visual pipeline for rendering the bunker, moving Alex through it, and keeping his facing/posture in sync with narrative actions. Use this guide as a wiring diagram so you can make the room render when Alex leaves the monitor and reuse his pose/facing variants without digging through components.

## Data flow in three hops
1. **State** – `finder.spatial` in `GameState` holds `x`, `z`, `angle`, and `posture` (see `types.ts`). Narrative actions update it through `SpatialEngine.updateSpatial` in `engine/NarrativeSystem.ts` (on MOVE/INTERACT/FLEE) or directly in `GameEngine` when changing locations.
2. **Camera + room** – `SceneShell` injects `finder.spatial` into `components/Visuals/RemoteView`. That component applies camera parallax/zoom CSS variables and renders the wireframe room via `RoomGeometry`.
3. **Alex rendering** – `RemoteView` passes the same spatial payload into `components/Visuals/AlexSilhouette`, which translates the mesh in 3D space, rotates it based on `angle`, and swaps posture classes (standing, crouched, reaching, inspecting, etc.) to change shape and micro-animations.

If `world.isRemoteViewActive` is true (default in `config/initialState.tsx`), the stack is live without extra wiring.

## Moving Alex around
- Call `SpatialEngine.updateSpatial(currentSpatial, targetId)` with a semantic target (e.g., `"LAB_SAFE"`, `"AUX_BREAKER"`, `"DOOR"`, `"FAR_LEFT"`). Anchors are defined in `engine/SpatialEngine.ts` as `LAB_ANCHORS` and exported for reuse.
- For MOVE/INTERACT/FLEE actions the existing narrative system already calls this method; ensure your AI response sets `attemptedAction.target` to the desired anchor key or a fuzzy match (e.g., `"server"` resolves to `SERVER_LEFT`/`SERVER_RIGHT`).
- To force a specific starting pose when entering a room, update `finder.spatial` directly (see the NAV branch in `engine/GameEngine.ts`).

## Controlling facing and posture
- `angle` controls facing; `AlexSilhouette` categorizes it via `SpatialEngine.getFacingCategory` to swap between front/profile/back silhouettes. Positive angles turn him to your left, negative to your right.
- `posture` comes from either the anchor’s default or `getDynamicPosture(targetId, basePosture)` which auto-switches to CROUCHED/REACHING/LEANING/LOOKING_UP depending on the target keyword. Override `posture` manually in state if you want to pin him to a specific stance regardless of target.
- Depth (`z`) also tweaks blur/brightness so pushing Alex to the back wall naturally dims/softens him while keeping the camera parallax aligned.

## Checklist to see Alex off-monitor
1) Keep `world.isRemoteViewActive` true and send a MOVE/INTERACT action with a non-console target (e.g., `"LAB_SAFE"`).
2) Confirm `finder.spatial` updates in state logs; the RemoteView camera will pan/zoom automatically.
3) Watch the silhouette: posture classes (`posture-*`) animate different stances, and `angle` pivots the mesh. No extra React props are needed—just mutate the spatial state.

This flow gives you a single state change to drive room layout, camera, and Alex’s pose/facing, so narrative authors can script movement without touching rendering code.
