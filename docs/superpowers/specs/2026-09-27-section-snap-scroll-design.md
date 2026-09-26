# Design Specification: Eager Section Snap Scroll

**Date:** 2026-09-27  
**Status:** Approved  
**Topic:** Section Snap Navigation with GSAP Observer & ScrollToPlugin  

## 1. Problem Statement & UX Goal
In the current application, sections have CSS `scroll-snap-type: y mandatory`. When a user performs a slight swipe/drag ("vuốt nhẹ" ~30-50px) on mobile or a gentle mouse wheel / trackpad flick on desktop, native browser scroll snap allows the screen to budge partway (causing elements like "Cuộn xuống nhé" to be partially pushed up or awkwardly offset) before either getting stuck or snapping backward if momentum does not exceed the browser threshold.

**Goal:** Provide an eager, responsive, and seamless slide-by-slide navigation experience. As soon as a light swipe (~35px) or gentle scroll gesture is detected, the page smoothly and precisely animates to the next (or previous) section, keeping each screen cleanly framed.

---

## 2. Architecture & Components

### 2.1 Section Snap Controller (`hooks/useSectionSnap.ts` & `components/SectionNavigator.tsx`)
- A centralized React hook / client component mounted in `app/page.tsx`.
- Discovers all snap sections dynamically via query selector `[data-snap-section="true"]`.
- Maintains the current section index (`currentIndex`) and syncs with `window.scrollY` / viewport center on resize and initial render.
- Integrates GSAP's `Observer` plugin and `ScrollToPlugin` (both provided by the installed `gsap` package).

### 2.2 Gesture & Input Handling
- **Touch Gestures (Mobile):** Configured with an eager tolerance (`tolerance: 35px`). A swipe distance of ~35px immediately fires a section transition.
- **Wheel & Trackpad (Desktop):** Configured with low tolerance (`wheelSpeed: -1`, `tolerance: 20px`), triggering a section advance upon a single gentle turn or trackpad flick.
- **Keyboard Navigation:** Listens to `keydown` for `ArrowDown`, `ArrowUp`, `PageDown`, `PageUp`, `Space` to provide accessible slide navigation.

### 2.3 Interaction Locks & Exclusion Handling
- **Animation Cooldown / Lock (`isAnimating` flag):** When a section transition begins, `isAnimating` is set to `true` for ~750ms. Any further swipe or trackpad inertia events during this window are discarded, preventing multi-section skips.
- **Exclusion Zones (`[data-no-snap]`):**
  - In `BirthdayCake`, horizontal knife dragging must not trigger vertical page snap. Gestures initiating inside elements with `data-no-snap="true"` (or where horizontal displacement `|deltaX| > |deltaY|`) will not trigger section navigation.
- **Lightbox / Modal Suspension:**
  - When the Lightbox in `MemoryGallery` is active, the snap observer is temporarily disabled so users can view and interact with the image freely.

### 2.4 Animation & CSS Tuning
- **GSAP ScrollTo Transition:**
  - Transition executed via `gsap.to(window, { scrollTo: { y: targetOffset, autoKill: false }, duration: 0.7, ease: "power2.out", onComplete: () => { isAnimating = false; } })`.
- **CSS Synchronization in `app/globals.css`:**
  - Replace conflicting `scroll-snap-type: y mandatory` on `html` which fights smooth programmatic scrolling and causes rubber-banding or stutter on touch devices.
  - Keep each `.snap-section` at `min-height: 100dvh` / `height: 100dvh` and full width.
  - Update `ScrollIndicator` to integrate directly with `SectionNavigator` or programmatic scroll.

---

## 3. Data Flow & State Management

```
User Gesture (Touch Swipe / Wheel / Key)
                 │
                 ▼
       GSAP Observer Check
                 │
  ┌──────────────┴──────────────┐
  │ Excluded? (Modal / Knife)    │ ─── YES ──► Ignore gesture
  └──────────────┬──────────────┘
                 │ NO
  ┌──────────────┴──────────────┐
  │ Exceeds threshold (35px)?    │ ─── NO ───► Ignore
  └──────────────┬──────────────┘
                 │ YES
  ┌──────────────┴──────────────┐
  │ Already animating (locked)? │ ─── YES ──► Ignore
  └──────────────┬──────────────┘
                 │ NO
                 ▼
   Determine Direction (+1 / -1)
   Calculate Target Section Offset
   Lock Animation (isAnimating = true)
                 │
                 ▼
  gsap.to(window, { scrollTo: target, duration: 0.7, ease: "power2.out" })
                 │
                 ▼
          onComplete Callback
      Unlock Animation (isAnimating = false)
      Update Current Section Index
```

---

## 4. Verification & Testing Criteria
1. **Mobile Touch Swipe:** Vuốt nhẹ (>35px) ở bất kỳ section nào lập tức chuyển dứt khoát sang section kế tiếp, không bị trôi lỡ cỡ.
2. **Desktop Wheel / Keyboard:** Lăn chuột nhẹ 1 nấc hoặc bấm phím mũi tên chuyển mượt mà 1 section.
3. **No Over-scrolling:** Lướt nhanh liên tục không làm trang bị giật hay nhảy cóc 2-3 section một lúc nhờ cơ chế lock 750ms.
4. **Interactive Safety:** Kéo dao cắt bánh kem trong `BirthdayCake` hoạt động bình thường, không bị nhảy section. Lightbox trong `MemoryGallery` mở lên không bị ảnh hưởng.
5. **ScrollIndicator Sync:** Nhấp vào nút "Cuộn xuống nhé" / "Mở hộp quà nhé" vẫn hoạt động mượt mà đến đúng section kế tiếp.
