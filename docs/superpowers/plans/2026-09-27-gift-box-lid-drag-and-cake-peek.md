# Gift Box Lid Drag-and-Drop & Slow Cake Rise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the gift box lid to fit snugly with the box body, and implement real-time upward drag-and-drop physics where pulling the lid peeks the cake inside, snapping back if released early and triggering a slow, cinematic cake rise when opened.

**Architecture:** Utilize Framer Motion's gesture and drag system (`drag="y"`, `useMotionValue`, `useTransform`) in `GiftAndCakeScene.tsx` to couple lid displacement with a peeking cake sub-layer in real time, with spring-based snap-back physics and thresholded celebration triggers.

**Tech Stack:** Next.js (App Router), React 18, Framer Motion, Tailwind CSS, canvas-confetti, TypeScript.

## Global Constraints

- Lid dimensions must fit snugly: `w-46 md:w-54` (vs box body `w-44 md:w-52`) with overhang $\approx 4\text{px}$ per side, height `h-8 md:h-9`.
- Drag direction: vertical upward only (`drag="y"`, top constraint: -140px, bottom constraint: 0px).
- Dynamic real-time peek: dragging lid up from 0 to -70px pulls the candles and top tier up from hidden (+15px) to visible (-20px).
- Release threshold: $\le -65\text{px}$ or velocity $\le -250\text{px/s}$. Under threshold springs back to 0; over threshold flies lid off and begins slow cake rise.
- Slow cake rise: duration $\ge 2.4\text{s}$ with smooth cubic-bezier easing `[0.16, 1, 0.3, 1]`.
- Stage 4 (love letter) mirrors the exact same fitted lid and drag mechanic.

---

### Task 1: Redesign Lid Dimensions, Proportions & Visual Drag Hints

**Files:**
- Modify: `components/GiftAndCakeScene.tsx`

**Interfaces:**
- Consumes: `BIRTHDAY_CONFIG` from `@/lib/constants`
- Produces: Updated box lid UI with tailored width `w-46 md:w-54`, height `h-8 md:h-9`, centered ribbon bow `w-7 h-7`, idle bouncing indicator, and prompt text `"Kéo nắp hộp lên nhé 🎁"`.

- [ ] **Step 1: Inspect and update lid JSX and CSS in `GiftAndCakeScene.tsx`**
Update the closed box lid markup in Stage 1 and Stage 4 to use the fitted width and refined height, aligning the vertical ribbon with the box body. Add an upward arrow visual cue and update the prompt text to `"Kéo nắp hộp lên nhé 🎁"`.

- [ ] **Step 2: Verify TypeScript compilation**
Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit Task 1 changes**
```bash
git add components/GiftAndCakeScene.tsx
git commit -m "feat: refine gift box lid dimensions and add drag indicators"
```

---

### Task 2: Implement Real-time Drag Physics, Cake Peek & Slow Rise

**Files:**
- Modify: `components/GiftAndCakeScene.tsx`

**Interfaces:**
- Consumes: Framer Motion `motion`, `useMotionValue`, `useTransform`, `animate`
- Produces: Interactive draggable lid with real-time cake peek, spring snap-back, threshold detection, and slow 2.4s cake emergence.

- [ ] **Step 1: Add MotionValues and Drag Listeners**
In `GiftAndCakeScene.tsx`:
- Instantiate `lidY = useMotionValue(0)` and `lidRotate = useTransform(lidY, [0, -100], [0, -4])`.
- Create `cakePeekY = useTransform(lidY, [0, -80], [20, -20])` and `cakePeekOpacity = useTransform(lidY, [0, -30, -80], [0, 0.6, 1])`.
- Embed a peeking preview container positioned right beneath the lid rim (clipped or layered behind the box front) containing the cake's candles and top tier.
- Add `drag="y"`, `dragConstraints={{ top: -140, bottom: 0 }}`, `dragElastic={{ top: 0.25, bottom: 0.05 }}` on the lid element.
- Implement `onDragEnd`:
  - Check `info.offset.y <= -65 || info.velocity.y <= -250`.
  - If threshold met: trigger `handleOpenBox1()` which plays confetti, flies lid away, and sets `stage = "cake_emerge"`.
  - If threshold not met: animate `lidY` back to `0` with spring config (`stiffness: 450, damping: 28`).

- [ ] **Step 2: Update `cake_emerge` Animation to Cinematic Slow Rise**
Update the emerging cake animation:
```tsx
<motion.div
  initial={{ scale: 0.35, y: 70, opacity: 0 }}
  animate={{ scale: 1, y: 0, opacity: 1 }}
  transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
  className="relative z-20 flex flex-col items-center"
>
```

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit Task 2 changes**
```bash
git add components/GiftAndCakeScene.tsx
git commit -m "feat: implement lid drag-and-drop with cake peek and slow rise"
```

---

### Task 3: Symmetrical Drag Implementation for Letter Box & Full Verification

**Files:**
- Modify: `components/GiftAndCakeScene.tsx`

**Interfaces:**
- Consumes: Stage 4 state (`stage === "box_return"`)
- Produces: Consistent drag opening interaction for revealing the love letter.

- [ ] **Step 1: Wire drag interaction and letter peek into Stage 4**
Implement the same `drag="y"` and motion value mapping for the returning box in `stage === "box_return"`, showing the peeking letter envelope as the lid is pulled, and triggering `handleOpenBox2()` upon passing the threshold.

- [ ] **Step 2: Run production build and lint checks**
Run: `npm run build`
Expected: Successful build with exit code 0.

- [ ] **Step 3: Commit Task 3 changes**
```bash
git add components/GiftAndCakeScene.tsx
git commit -m "feat: apply drag opening to letter reveal and verify build"
```
