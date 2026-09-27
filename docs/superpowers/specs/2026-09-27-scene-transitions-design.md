# Design Specification: Scene Transitions & Back Button Removal

## 1. Overview
This specification details the UI/UX enhancements for the birthday celebration web experience:
- Remove the top-left back button (`BackButton`) across all scenes while retaining the final "Quay lại từ đầu" restart button at the finale scene.
- Slow down scene transitions to create a gentle, romantic, and dreamy pacing.
- Replace the existing blur-scale fade-in/fade-out scene transition with a continuous Right-to-Left slide motion for typography and scene text content.
- Keep the dark starry night and particle background static so only the text/scene elements smoothly glide across.

## 2. Changes & Architecture

### 2.1 Back Button Removal
- In `components/SceneManager.tsx`, remove the `<BackButton ... />` element and its unused imports.
- Keep `prevScene` logic in `hooks/useSceneNavigation.ts` for safety/cleanliness, but ensure the button is no longer rendered in the UI.
- Preserve the restart button (`Quay lại từ đầu`) in `components/FinaleFlowerScene.tsx`.

### 2.2 Slower Scene Transitions (Right-to-Left Slide)
- In `components/SceneManager.tsx`:
  - Define custom motion variants for the main content wrapped in `AnimatePresence mode="wait"`:
    - `initial`: `{ opacity: 0, x: 90, filter: "blur(4px)" }`
    - `animate`: `{ opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] } }`
    - `exit`: `{ opacity: 0, x: -90, filter: "blur(4px)", transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } }`
  - Ensure the keying `${currentScene}-${currentScene === "sweet_words" ? subStep : ""}` continues to trigger on both scene switches and sweet-word sub-step transitions.
- In `components/IntroScene.tsx`:
  - Align text entrance animations with horizontal right-to-left glide (`x: 40 -> 0`) instead of upward vertical bounce (`y: 25 -> 0`).
  - Keep elegant typography and glow effects intact.
- In `components/SweetWordsScene.tsx`:
  - Retain the clean text container while letting the parent `SceneManager` drive the right-to-left glide across sub-steps (0 through 3).

### 2.3 Navigation Throttle & Pacing
- In `hooks/useSceneNavigation.ts`:
  - Update `lastNavTimeRef` cooldown threshold from `850ms` to `1400ms`.
  - This guarantees user clicks during the 1.3s transition do not prematurely advance scenes or cause stuttering.

## 3. Verification & Testing
- Run `npm run build` or Next.js build verification to ensure no TypeScript or JSX compilation errors.
- Test step-by-step navigation:
  - Intro scene: Check text enters smoothly with subtle right-to-left motion. Check that top-left back button is absent.
  - Sweet words (substeps 0 to 3): Verify each phrase slides in from right and exits to left gracefully at the slower speed.
  - Transition into Gift & Cake scene: Smooth entrance, gift box interactive states remain functional.
  - Complete flow to Finale Flower scene: Verify "Quay lại từ đầu" button is present and functional.
