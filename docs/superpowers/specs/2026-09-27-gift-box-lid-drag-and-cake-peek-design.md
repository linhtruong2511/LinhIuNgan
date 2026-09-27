# Design Specification: Gift Box Lid Drag-and-Drop & Slow Cake Rise

**Date**: 2026-09-27  
**Status**: Approved by User  
**Target File**: `components/GiftAndCakeScene.tsx`

---

## 1. Overview & Objectives

In the birthday website celebration experience, the current gift box opening in `GiftAndCakeScene.tsx` relies on a simple click to fly the lid away. The user requested two key improvements:
1. **Fitted Box Lid**: Resize and refine the lid proportions so it snugly fits the box body rather than being overly wide and top-heavy.
2. **Drag-and-Drop Interaction with Real-time Peek & Slow Rise**:
   - Allow users to physically grab and drag the lid upwards (supporting both mobile touch and desktop mouse).
   - While dragging the lid, the cake inside incrementally peeks out in real time following the user's hand/drag distance.
   - If released before reaching the opening threshold, the lid and cake snap back naturally via spring physics.
   - Once dragged past the threshold (or swiped up briskly), the lid floats away, confetti explodes, and the birthday cake slowly and smoothly rises out of the box into the spotlight.
   - The same refined drag mechanic is symmetrically applied to Stage 4 (opening the box to reveal the love letter).

---

## 2. Visual & Dimensional Specifications

### Box Body (Reference)
- Width: `w-44` (176px) on mobile, `w-52` (208px) on desktop (`md:` breakpoint).
- Height: `h-36` (144px) on mobile, `h-40` (160px) on desktop.
- Style: Crimson/ruby gradient `from-rose-700 via-red-800 to-red-950` with gold vertical ribbon (`w-8`) and rounded bottom corners (`rounded-b-2xl`).

### Fitted Box Lid (Redesigned)
- **Width**: `w-46 md:w-54` (184px / 216px). This creates an overhang of only 4px on each side over the box body (down from the previous 16px overhang), creating a tailored, premium look.
- **Height**: `h-8 md:h-9` (32px / 36px) — sleek and slimmed down from `h-10 md:h-12`.
- **Bow & Ribbon**:
  - Two ribbon loops resized to `w-7 h-7` (down from `w-8 h-8`), with a central gem of `w-4.5 h-4.5`.
  - Gold ribbon on lid aligns seamlessly with the box body ribbon.
- **Visual Drag Hint**:
  - Upward floating animated arrow icon `▲` or subtle pulsing chevron above the bow.
  - Idle breathing/bounce animation on the lid every 2.5s to invite interaction.
  - Instruction text: `"Kéo nắp hộp lên nhé 🎁"`.

---

## 3. Interaction Mechanics & Animation Flow

### 3.1 Drag Physics (Framer Motion)
- **Constraints**: `drag="y"`, `dragConstraints={{ top: -140, bottom: 0 }}`, `dragElastic={{ top: 0.25, bottom: 0.05 }}`.
- **Cursor**: `cursor-grab active:cursor-grabbing` on desktop, `touch-none` for fluid mobile dragging without triggering page scroll.
- **Motion Values**:
  - Track lid displacement $y \in [0, -120]$.
  - Map $y$ to cake peek displacement: when lid moves $0 \rightarrow -70\text{px}$, the peeking cake inside moves from $+15\text{px}$ (hidden behind rim) to $-20\text{px}$ (candles and top tier visible).
  - Lid rotation mapped slightly: $\pm 3^\circ$ based on drag velocity/wobble for tactile realism.

### 3.2 Threshold & Release Handling
- **Opening Threshold**: $y \le -65\text{px}$ or upward velocity $v_y \le -250\text{px/s}$.
- **Case A: Under Threshold (Snap-back)**:
  - Lid and cake animate back to $y = 0$ using `type: "spring", stiffness: 450, damping: 28`.
  - Box remains closed; user can try again.
- **Case B: Over Threshold (Unlocking Celebration)**:
  - Lid flies away to $y: -220\text{px}, \text{rotate}: -15^\circ, \text{opacity}: 0$ with duration 0.6s.
  - Confetti burst triggers from box center (`particleCount: 85, spread: 75`).
  - Transition stage to `"cake_emerge"`.
  - Cake undergoes **Cinematic Slow Rise**:
    - Duration: `2.4s` to `2.6s`.
    - Easing: `[0.16, 1, 0.3, 1]` (luxurious, silky slow entrance).
    - Moves smoothly from inside the box up to center stage.
  - Upon full arrival: Draggable knife and cutting prompt appear.

### 3.3 Stage 4: Letter Box Opening
- The exact same drag-and-drop mechanic is used when reopening the box for the love letter.
- Dragging lid up reveals the peeking letter envelope/scroll.
- Threshold triggers lid fly-away, confetti burst, and slow emergence of the letter.

---

## 4. Component Structure & Data Flow

### Files Modified:
- `components/GiftAndCakeScene.tsx`:
  - Integrate Framer Motion `motion.div` with drag listeners for the lid in `box_closed` and `box_return`.
  - Implement real-time peek container for cake (Stage 1) and letter (Stage 4) using `useMotionValue` and `useTransform`.
  - Update lid dimensions and styling classes to `w-46 md:w-54` and `h-8 md:h-9`.
  - Update instruction copy and visual hint indicators.
  - Extend cake rise animation duration to `2.4s` with elegant cubic-bezier easing.

---

## 5. Verification & Testing Criteria

1. **Visual Fit**: Confirm visually that the lid matches the box body with an elegant 4px lip on both sides.
2. **Desktop Dragging**: Test mouse click-and-drag upward; verify cursor changes, smooth resistance, and spring back on small drag.
3. **Mobile Touch Dragging**: Verify touch swipe up pulls the lid without jank or unwanted scroll interference.
4. **Real-Time Peek**: Verify candles and cake top peek out progressively as the lid is pulled upwards before release.
5. **Threshold Triggering**: Verify pulling past 65px cleanly triggers the lid opening animation, confetti burst, and slow cinematic cake rise.
6. **Cake Cut & Letter Sequence**: Verify the cake cutting still functions properly, the box returns cleanly, and the second drag for the letter works with the exact same refined feel.
