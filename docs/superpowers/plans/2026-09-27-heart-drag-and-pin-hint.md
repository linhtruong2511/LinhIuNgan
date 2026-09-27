# Heart Drag-and-Drop and Dynamic PIN Hint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement individual drag-and-drop for the two heart halves into a target silhouette, and show the secret PIN hint only after an incorrect entry.

**Architecture:** 
- In `lib/constants.ts`, update the instruction and hint copy.
- In `components/SecretPuzzleModal.tsx`, replace the tap gesture with two separate draggable Framer Motion components (`isLeftMatched`, `isRightMatched`) targeting a central dashed heart outline.
- Add dynamic hint display in `components/SecretPuzzleModal.tsx` controlled by `showHint` state toggled upon incorrect PIN input.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, canvas-confetti.

## Global Constraints
- Target PIN: "3004"
- Hint text: "Gợi ý: Ngày chúng mình chính thức yêu nhau"
- Instruction text: "Kéo từng mảnh ghép vào đúng vị trí nhé ✨"

---

### Task 1: Update Constants Copy

**Files:**
- Modify: `lib/constants.ts:40-43`

**Interfaces:**
- Produces: `BIRTHDAY_CONFIG.secretPinHint` and `BIRTHDAY_CONFIG.puzzleInstruction`

- [ ] **Step 1: Update `lib/constants.ts`**
Update `secretPinHint` to `"Gợi ý: Ngày chúng mình chính thức yêu nhau"` and `puzzleInstruction` to `"Kéo từng mảnh ghép vào đúng vị trí nhé ✨"`.

- [ ] **Step 2: Verify TypeScript compilation**
Run `npx tsc --noEmit` to ensure no type errors.

- [ ] **Step 3: Commit**
```bash
git add lib/constants.ts
git commit -m "feat(constants): update puzzle instruction and secret pin hint copy"
```

---

### Task 2: Implement Heart Drag-and-Drop in `SecretPuzzleModal`

**Files:**
- Modify: `components/SecretPuzzleModal.tsx:19-180`

**Interfaces:**
- Consumes: `BIRTHDAY_CONFIG.puzzleInstruction`
- Produces: Drag & drop interactions for left and right heart halves, snapping into target center.

- [ ] **Step 1: Add state for left and right heart placement**
Introduce `isLeftMatched` and `isRightMatched` states.
Handle snapping logic: when `info.offset.x` moves toward center past threshold (~35px), lock that piece in place (`x: 0`).
When both are locked, fire confetti and advance to `enter_pin` after delay.

- [ ] **Step 2: Add central heart drop-zone target and separate draggable halves**
Render center target outline (heart silhouette with dashed border).
Render Left Half (`x: isLeftMatched ? 0 : -64`, draggable when `!isLeftMatched`).
Render Right Half (`x: isRightMatched ? 0 : 64`, draggable when `!isRightMatched`).
Add visual cues (glow, pulse, instruction label).

- [ ] **Step 3: Verify component syntax and compilation**
Run `npx tsc --noEmit`.

- [ ] **Step 4: Commit**
```bash
git add components/SecretPuzzleModal.tsx
git commit -m "feat(puzzle): add drag and drop heart halves mechanism"
```

---

### Task 3: Implement Dynamic PIN Hint Display in `SecretPuzzleModal`

**Files:**
- Modify: `components/SecretPuzzleModal.tsx`

**Interfaces:**
- Consumes: `BIRTHDAY_CONFIG.secretPinHint`
- Produces: Hidden hint initially; visible hint when PIN is incorrect.

- [ ] **Step 1: Add `showHint` state and update keypad handler**
Initialize `const [showHint, setShowHint] = useState(false);`.
When incorrect PIN is submitted: set `setIsError(true)` and `setShowHint(true)`.

- [ ] **Step 2: Render hint conditionally**
Only render the hint paragraph when `showHint` is true with fade-in animation.

- [ ] **Step 3: Verify TypeScript compilation and dev server check**
Run `npx tsc --noEmit` and verify on `http://localhost:3000`.

- [ ] **Step 4: Commit**
```bash
git add components/SecretPuzzleModal.tsx
git commit -m "feat(puzzle): show PIN hint only after incorrect attempt"
```
