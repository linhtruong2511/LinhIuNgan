# Scene Transitions & Navigation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the back button, slow down scene transitions to 1.3s, and make text glide from right to left between scenes.

**Architecture:** Update `SceneManager` Framer Motion transition variants to slide along the X-axis (`x: 90 -> 0 -> -90`), align `IntroScene` entrance animation with the horizontal flow, remove the `BackButton` from `SceneManager`, and increase navigation cooldown in `useSceneNavigation` to 1400ms.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion

## Global Constraints

- Keep the dark starry night particles and ambient background fixed/static.
- Preserve the restart button (`Quay lại từ đầu`) in `FinaleFlowerScene`.
- Ensure debounce in `useSceneNavigation` matches the 1.3s transition duration (1400ms threshold).
- All changes must pass `npm run build` without TypeScript or lint errors.

---

### Task 1: Update navigation throttle cooldown in `useSceneNavigation`

**Files:**
- Modify: `hooks/useSceneNavigation.ts:37-38`

**Interfaces:**
- Consumes: Navigation click timestamp `lastNavTimeRef.current`
- Produces: `nextScene` and `prevScene` throttled to 1400ms cooldown

- [ ] **Step 1: Update throttle limit in `useSceneNavigation.ts`**

Change cooldown threshold from `850` to `1400` in `nextScene` and `prevScene`:

```typescript
const now = Date.now();
if (now - lastNavTimeRef.current < 1400) return;
lastNavTimeRef.current = now;
```

- [ ] **Step 2: Commit changes**

```bash
git add hooks/useSceneNavigation.ts
git commit -m "fix(nav): increase navigation cooldown to 1400ms for slow transitions"
```

---

### Task 2: Remove BackButton and add Right-to-Left slide variants in `SceneManager`

**Files:**
- Modify: `components/SceneManager.tsx:6, 69-73, 89-95`

**Interfaces:**
- Consumes: `currentScene`, `subStep`, `AnimatePresence`
- Produces: Smooth right-to-left animated transitions without top-left back button

- [ ] **Step 1: Remove BackButton import and element**

Remove `import BackButton from "./BackButton";` and `<BackButton ... />` from `components/SceneManager.tsx`.

- [ ] **Step 2: Update transition variants in `SceneManager.tsx`**

Replace:
```tsx
initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
```

With:
```tsx
initial={{ opacity: 0, x: 90, filter: "blur(4px)" }}
animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
exit={{ opacity: 0, x: -90, filter: "blur(4px)" }}
transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
```

- [ ] **Step 3: Commit changes**

```bash
git add components/SceneManager.tsx
git commit -m "feat(ui): remove back button and implement right-to-left scene slide transition"
```

---

### Task 3: Align text entrance animation in `IntroScene`

**Files:**
- Modify: `components/IntroScene.tsx:26-33, 41-48, 55-58`

**Interfaces:**
- Consumes: Framer motion `variants`
- Produces: Entrance animation where text slides in from right (`x: 50 -> 0`)

- [ ] **Step 1: Update title, subtitle, and paragraph variants**

In `components/IntroScene.tsx`, update heading variants:
```tsx
hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
visible: {
  opacity: 1,
  x: 0,
  filter: "blur(0px)",
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
}
```
And description paragraph:
```tsx
hidden: { opacity: 0, x: 30 },
visible: { opacity: 0.8, x: 0, transition: { duration: 1.0, ease: "easeOut" } },
```

- [ ] **Step 2: Commit changes**

```bash
git add components/IntroScene.tsx
git commit -m "feat(intro): glide intro texts from right to left on mount"
```

---

### Task 4: Verify build and test flow

**Files:**
- Test: Next.js build verification

- [ ] **Step 1: Run production build check**

Run: `npm run build`
Expected: Compile successfully with exit code 0.

- [ ] **Step 2: Final commit if needed and report status**

```bash
git status
```
