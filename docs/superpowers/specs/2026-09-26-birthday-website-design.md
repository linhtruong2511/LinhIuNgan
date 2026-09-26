# Birthday Website — Design Specification

## Overview

Trang web đơn trang (SPA) chúc mừng sinh nhật người yêu, với trải nghiệm cinematic scroll-driven kết hợp interactive gestures. Tone màu xanh-đỏ lộng lẫy, hiệu ứng chuyển động mượt mà, tối ưu cho mobile.

## Tech Stack

| Layer | Technology | Lý do |
|-------|-----------|-------|
| Framework | Next.js 14 (App Router) + TypeScript | SSG, deploy Vercel |
| Animation | GSAP + ScrollTrigger | Scroll-driven animations, pin sections |
| Micro-interactions | Framer Motion | Mở thư, flip card, tap effects |
| Styling | Tailwind CSS (mobile-first) | Rapid development, responsive |
| Confetti | canvas-confetti | Hiệu ứng pháo hoa/confetti |
| Deploy | Vercel | Zero-config Next.js hosting |

## Color Palette

| Token | Hex | Mô tả |
|-------|-----|-------|
| `deep-night` | `#0A1628` | Nền tối chủ đạo |
| `ocean-blue` | `#1E3A5F` | Nền section phụ |
| `teal-accent` | `#4ECDC4` | Accent text, glow |
| `rose-red` | `#E63946` | Đỏ chủ đạo, nút bấm |
| `coral` | `#FF6B6B` | Đỏ nhẹ, highlight |
| `candle-gold` | `#FFD93D` | Vàng nến, sparkle |
| `paper-cream` | `#FFF8E7` | Nền giấy thư |

Gradient xuyên suốt: từ `deep-night` (xanh đậm) ở đầu trang → dần chuyển sang `rose-red`/`coral` (đỏ ấm) ở cuối trang, tạo cảm giác từ "đêm kỳ diệu" sang "nồng ấm yêu thương".

## Typography

| Sử dụng | Font | Nguồn |
|---------|------|-------|
| Tiêu đề, chữ đẹp | Dancing Script | Google Fonts |
| Nội dung thư tay | Great Vibes | Google Fonts |
| Body text | Inter | Google Fonts |

## Flow — 6 Sections

### Section 1: Intro Splash (Auto-play)

**Mục đích:** Ấn tượng đầu tiên, tạo cảm giác kỳ diệu.

**Chi tiết:**
- Full viewport height, background gradient `deep-night`
- Hiệu ứng particles lấp lánh (sao/bụi sáng) bay khắp màn hình — canvas-based, giảm số lượng trên mobile
- Animation sequence tự động (3-4 giây):
  1. Particles sáng lên dần từ tối → sáng
  2. Text "Happy Birthday" fade-in + scale-up từ giữa (font Dancing Script, màu trắng + glow)
  3. Tên người yêu hiện ra lớn bên dưới (fade-in + letter-spacing animation)
  4. Subtitle nhỏ: "Cuộn xuống để khám phá điều bất ngờ nhé ✨"
- Mũi tên bounce nhẹ ở bottom, gợi ý scroll

**Nhạc nền:**
- Button nhỏ góc phải "🎵 Bật nhạc" — tap để play nhạc nền
- Nhạc chỉ play sau user gesture (browser autoplay policy)
- Nút toggle on/off suốt trang

### Section 2: Sweet Words (Scroll-driven)

**Mục đích:** Dẫn dắt cảm xúc, tạo sự hồi hộp.

**Chi tiết:**
- 3-4 đoạn text ngắn, mỗi đoạn chiếm ~70vh
- Mỗi đoạn fade-in + slide-up khi scroll tới (GSAP ScrollTrigger)
- Background: hình/video blurred làm nền, parallax effect (chuyển động chậm hơn text)
- Typography lớn, centered, màu trắng trên nền tối
- Gradient nền chuyển dần từ xanh → xanh-đỏ
- Nội dung text lưu trong `constants.ts`, dễ thay đổi

### Section 3: Gift Box (PIN + Tap interaction)

**Mục đích:** Bất ngờ! Mở hộp quà.

**Chi tiết:**
- Khi scroll tới → section **pin** (đứng yên, không scroll qua)
- Hộp quà render bằng CSS 3D transforms:
  - Hộp chính hình hộp, gradient đỏ `rose-red`, ruy-băng vàng `candle-gold`
  - Nắp hộp đóng
- Text: "Nhấn để mở quà nhé 🎁" (pulse animation)
- **Tap/Click:** 
  - Nắp hộp lật mở (3D rotation animation, 0.8s ease)
  - canvas-confetti bung tỏa từ vị trí hộp quà
  - Ánh sáng golden glow phát ra từ bên trong hộp
- Sau animation hoàn tất (1.5s) → **unpin**, scroll tiếp

### Section 4: Birthday Cake (PIN + Drag/Swipe gesture)

**Mục đích:** Cắt bánh sinh nhật — interactive fun.

**Chi tiết:**
- Transition liền mạch từ Gift Box: bánh "bay lên" từ trong hộp quà
- Bánh sinh nhật render bằng CSS/SVG:
  - 2-3 tầng, gradient hồng-đỏ
  - Nến trên đỉnh với animation lửa (CSS flicker animation)
  - Trang trí kem, hoa nhỏ
- Pin section, hiện text: "Cắt bánh nào! 🎂"
- Hiển thị con dao (SVG) ở cạnh bánh
- **Gesture:** User drag/swipe con dao ngang qua bánh:
  - Dao di chuyển theo touch/mouse
  - Khi dao qua giữa bánh → animation bánh tách đôi
  - Sparkle effects + mini confetti
- Sau khi cắt xong → unpin, scroll tiếp

### Section 5: Love Letter (PIN + Tap interaction)

**Mục đích:** Lời tâm tình — khoảnh khắc cảm động nhất.

**Chi tiết:**
- Phong bì thư hiện ra (CSS art):
  - Phong bì màu cream `paper-cream`, nắp tam giác đóng
  - Stamp nhỏ hình trái tim
  - Text trên phong bì: "Gửi [tên người yêu] ❤️"
- Pin section, text: "Có thư cho bạn nè 💌"
- **Tap phong bì:**
  - Nắp phong bì mở (flip animation)
  - Tờ thư kéo lên khỏi phong bì (slide-up animation)
  - Phong bì fade out, thư expand full viewport
- Nội dung thư:
  - Nền texture giấy cũ (hình nền repeating)
  - Font: Great Vibes (handwriting)
  - Nội dung hardcode trong `constants.ts`
  - Hiệu ứng text hiện từ từ (typewriter hoặc fade-in từng dòng)
  - Scrollable nếu thư dài
- Cuối thư: nút "Đã đọc xong ❤️" → unpin, scroll tiếp

### Section 6: Memory Gallery (Scroll-driven)

**Mục đích:** Kỷ niệm bung tỏa — kết đẹp.

**Chi tiết:**
- Transition: Bánh sinh nhật thu nhỏ về giữa, các frame hình/video bung tỏa xung quanh
- Layout: Các frame scatter xung quanh trung tâm (kiểu polaroid/collage)
  - Mỗi frame hơi nghiêng góc random (-5° đến +5°)
  - Animation: từ center → scatter ra vị trí final khi scroll
- Mỗi frame gồm:
  - Hình hoặc video thumbnail (border trắng kiểu polaroid)
  - Caption nhỏ bên dưới (font handwriting)
- **Tap frame:** Mở Lightbox overlay:
  - Background blur + dark overlay
  - Hình/video full-width (responsive)
  - Caption text bên dưới
  - Nút X hoặc tap outside để đóng
  - Swipe left/right để xem frame tiếp theo/trước
- Cuối section: Text lớn "Happy Birthday, [tên] ❤️" + confetti finale burst
- Hình/video data: array trong `constants.ts` (path, type, caption)

## Project Structure

```
d:\LinhIuNgan\
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main page — section orchestrator
│   └── globals.css         # Tailwind base + custom animations
├── components/
│   ├── IntroSplash.tsx     # Section 1
│   ├── SweetWords.tsx      # Section 2
│   ├── GiftBox.tsx         # Section 3
│   ├── BirthdayCake.tsx    # Section 4
│   ├── LoveLetter.tsx      # Section 5
│   ├── MemoryGallery.tsx   # Section 6
│   ├── Lightbox.tsx        # Gallery lightbox overlay
│   ├── ParticlesBg.tsx     # Canvas particles
│   ├── MusicPlayer.tsx     # Nhạc nền toggle
│   └── ScrollIndicator.tsx # Mũi tên scroll
├── hooks/
│   ├── useGSAP.ts          # Custom hook GSAP setup/cleanup
│   └── useMusicPlayer.ts   # Audio state management
├── lib/
│   ├── animations.ts       # GSAP animation presets
│   └── constants.ts        # Tên, lời nhỏ, nội dung thư, captions, media paths
├── public/
│   ├── images/             # Ảnh user bỏ vào
│   ├── videos/             # Video user bỏ vào  
│   ├── music/              # File nhạc nền (.mp3)
│   └── textures/           # Texture giấy thư
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Data Configuration (`lib/constants.ts`)

```typescript
export const BIRTHDAY_CONFIG = {
  name: "Linh", // Tên người yêu — thay đổi tại đây
  
  sweetWords: [
    "Có những ngày, chỉ cần nghĩ đến em thôi là đủ vui rồi...",
    "Em là điều tuyệt vời nhất mà anh từng có...",
    "Sinh nhật em, anh muốn tặng em cả thế giới...",
    "Nhưng trước hết, mở quà anh đã nào! 🎁"
  ],
  
  letterContent: `
    Gửi Linh yêu dấu,
    
    [Nội dung thư tay — user điền vào đây]
    
    Yêu em nhiều,
    [Tên]
  `,
  
  memories: [
    { src: "/images/photo1.jpg", type: "image", caption: "Lần đầu tiên..." },
    { src: "/videos/video1.mp4", type: "video", caption: "Ngày hôm đó..." },
    // ... thêm hình/video
  ]
};
```

## Mobile Optimization

- **Mobile-first design**: Tailwind responsive, tất cả element sizing dùng relative units
- **Touch gestures**: Drag (cắt bánh) dùng GSAP Draggable hoặc pointer events
- **Performance**:
  - Lazy load images (`next/image` + `loading="lazy"`)
  - Video poster image, load khi vào viewport (IntersectionObserver)
  - Particles: ~50 trên mobile vs ~150 trên desktop
  - `will-change` cho animated elements
  - GSAP `ScrollTrigger.matchMedia()` cho breakpoints
- **Audio**: Chỉ play sau user gesture đầu tiên (browser policy compliance)

## Error Handling

- Nếu hình/video load lỗi → fallback placeholder + alt text
- Nếu nhạc không load được → button disabled + tooltip
- GSAP animations degrade gracefully nếu browser không support
- Responsive fallback cho 3D transforms trên thiết bị yếu

## Testing Approach

- Visual testing thủ công trên mobile (Chrome DevTools device mode)
- Kiểm tra performance: Lighthouse mobile score > 80
- Test trên các trình duyệt: Chrome, Safari (iOS), Samsung Internet
- Test gesture interactions trên touch device thật
