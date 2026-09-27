# Thiết Kế Chi Tiết: Chuyển Đổi Hiệu Ứng Cuộn Thành Chuyển Cảnh Chạm (Tap Story Flow) & Khám Phá Bí Mật

**Ngày tạo**: 2026-09-27  
**Dự án**: Birthday Website (`LinhIuNgan`)  
**Tác giả**: Antigravity Assistant & Pair Programmer  
**Trạng thái**: Đã thống nhất thiết kế (Design Approved)

---

## 1. Tổng Quan & Mục Tiêu

### 1.1. Bối cảnh
Trước đây, website hoạt động theo cơ chế cuộn trang dọc kết hợp cuộn tự động (scroll snap) giữa các `<section>`. Cơ chế này dễ gây trôi màn hình, giật lag trên thiết bị di động và thiếu cảm giác liền mạch, dẫn dắt câu chuyện cảm xúc.

### 1.2. Mục tiêu chuyển đổi
1. **Khóa hoàn toàn cuộn trang (Zero Scroll)**: Loại bỏ triệt để thanh cuộn, thao tác lăn chuột (mouse wheel), vuốt cuộn (touch scroll) và phím điều hướng cuộn (`ArrowUp`, `ArrowDown`, `Space`, `PageDown`).
2. **Điều hướng bằng Chạm (Tap to Advance)**: Người dùng chạm bất kỳ đâu trên màn hình để chuyển cảnh sang phân đoạn tiếp theo.
3. **Chuyển động Điện ảnh (Cinematic Fade & Gentle Float)**:
   * Chuyển cảnh mềm mại sử dụng `Framer Motion` (`AnimatePresence mode="wait"`), kết hợp `opacity`, `scale` và `filter: blur()`.
   * Từng dòng chữ, bức ảnh xuất hiện so le (staggered delay), lướt êm dịu.
4. **Cốt truyện liền mạch từ "Chiếc hộp ma thuật"**:
   * Hộp quà mở ➔ Bánh kem trồi lên từ trong hộp ➔ Cắt bánh.
   * Hộp quà đẩy trở lại ➔ Mở quà tiếp ➔ Bức thư tay bay ra, mở nắp và hiện nét chữ.
   * Từng bức ảnh kỷ niệm lần lượt bay vút từ đáy hộp quà ra ngoài không gian và trôi nổi bềnh bồng.
5. **Khám phá ẩn & Câu đố bí mật (Secret Easter Egg)**:
   * Một điểm sáng bí mật ẩn giấu giữa những bức ảnh trôi nổi.
   * Chạm vào mở ra thử thách 2 bước:
     * **Bước 1**: Ghép 2 mảnh trái tim phát sáng lại làm một.
     * **Bước 2**: Nhập mã PIN bí mật 4 chữ số (cấu hình trong `lib/constants.ts`).
6. **Cảnh Kết Thúc (Finale)**:
   * Bông hoa nghệ thuật từ từ bung nở từng lớp cánh hoa (Blooming Flower SVG Animation).
   * Lời chúc sinh nhật thiêng liêng nhất hiện lên cùng mưa sao / pháo hoa vàng lấp lánh và nút xem lại từ đầu.

---

## 2. Kịch Bản Chi Tiết & Trình Tự Phân Cảnh (Scene Flow)

### Cảnh 1: Lời mở đầu (`intro`)
* **Nội dung**: *"Xin chào bạn nhỏ iu dấu của anh ❤️"* với ánh sáng dịu, hạt bụi sao trôi nổi phía sau.
* **Tương tác**: Hint mờ nhấp nháy ở cạnh dưới: *"Chạm vào màn hình để bắt đầu ✨"*.
* **Hành vi**: Chạm bất kỳ đâu ➔ Chuyển sang Cảnh 2.

### Cảnh 2: Chuỗi câu nói ngọt ngào (`sweet_words`)
Bao gồm 4 phân đoạn chữ nhỏ xuất hiện lần lượt theo từng cú chạm:
* **2.1**: *"Có những ngày, chỉ cần nghĩ đến em thôi là đủ vui rồi..."* ➔ Chạm.
* **2.2**: *"Em là điều tuyệt vời nhất mà anh từng có..."* ➔ Chạm.
* **2.3**: *"Sinh nhật em, anh muốn tặng em cả thế giới..."* ➔ Chạm.
* **2.4**: *"Nhưng trước hết, mở quà anh đã nào! 🎁"* ➔ Chạm ➔ Chuyển sang Cảnh 3.
* **Hiệu ứng**: Mỗi câu chữ chuyển vào bằng hiệu ứng lướt nhẹ từ dưới lên kèm làm rõ dần (`blur(6px) -> blur(0px)` và `opacity: 0 -> 1`).

### Cảnh 3: Hộp Quà Ma Thuật ➔ Bánh Sinh Nhật trồi lên (`gift_box_to_cake`)
* Hộp quà rực rỡ ở vị trí trung tâm.
* Người dùng chạm vào hộp: Nắp hộp bật mở, pháo hoa bắn nhẹ.
* **Chuyển động đặc biệt**: Chiếc bánh kem sinh nhật với 5 ngọn nến lung linh từ từ trồi lên từ đáy hộp quà (`y: 80px -> 0px` với hiệu ứng `spring`), hộp quà nhẹ nhàng thu nhỏ (`scale: 0.85`) lùi xuống làm bệ đỡ phía dưới.
* Tự động hoặc mở khóa chuyển sang trạng thái Cắt Bánh.

### Cảnh 4: Cắt Bánh Sinh Nhật (`cake_cutting`)
* Bánh kem lung linh cùng dao cắt bánh `🔪`.
* Người dùng kéo dao qua thân bánh ➔ Bánh tách làm đôi, nến thổi tắt lung linh, pháo hoa ngôi sao bung nở kèm lời chúc: *"Chúc em tuổi mới ngọt ngào như chiếc bánh này! 🎂✨"*.
* Sau khi cắt bánh xong, hiện gợi ý chạm tiếp tục hoặc tự chuyển tiếp sau 1.5s sang giai đoạn mở quà thứ 2.

### Cảnh 5: Hộp Quà Đẩy Lên ➔ Thư Tay Bay Ra (`gift_letter`)
* Bánh kem tan biến nhẹ nhàng. Hộp quà ở dưới được đẩy trở lại trung tâm với độ nảy nhẹ.
* Dòng chữ nhắc nhở: *"Vẫn còn một điều bất ngờ nữa trong hộp... 🎁"*.
* Người dùng chạm vào hộp quà ➔ Phong bì thư tình màu kem trang nhã từ trong hộp bay ra giữa màn hình.
* Phong bì mở nắp ➔ Từng nét chữ thư tay viết ra sống động (Typewriter motion).
* Đọc xong thư, hint nhấp nháy: *"Chạm để ngắm lại kỷ niệm của chúng mình 📸"*.

### Cảnh 6: Kỷ Niệm Bay Ra Từ Hộp Quà (`floating_memories`)
* Nắp hộp quà mở rộng.
* **Hiệu ứng**: Từng bức ảnh polaroid (tổng cộng 8 ảnh/video từ `BIRTHDAY_CONFIG.memories`) **lần lượt bay vút từ tâm hộp quà** bung ra các góc trên màn hình với độ trễ (delay) so le 0.35s mỗi ảnh.
* Sau khi bung ra, các bức ảnh chuyển sang trạng thái trôi nổi tự nhiên (gentle float animation với tọa độ ngẫu nhiên ±10px và góc nghiêng ±4deg).
* Người dùng có thể chạm vào ảnh bất kỳ để mở `Lightbox` phóng to ngắm nhìn và đọc caption kỷ niệm.
* **Khám phá ẩn (Easter Egg)**: Ở gần trung tâm (hoặc trôi nổi giữa các bức ảnh) có một **Trái tim pha lê / Quả cầu phát sáng** nhấp nháy nhịp tim chậm và dòng gợi ý kín đáo: *"Có một bí mật đang chờ em khám phá... 💖"*.

### Cảnh 7: Thử Thách Bí Mật (`secret_puzzle_modal`)
Khi người dùng chạm vào quả cầu bí mật, màn hình mờ tối lại và hiện giao diện thử thách:
* **Giai đoạn A - Ghép tim**:
  * Hai mảnh trái tim phát sáng xuất hiện tách rời ở 2 bên màn hình (Mảnh Trái neon hồng, Mảnh Phải neon đỏ).
  * Người dùng chạm hoặc kéo để 2 mảnh tim trượt vào giữa và khớp vào nhau.
  * Khi ghép đúng: Trái tim phát sáng rực rỡ, hiệu ứng hào quang bung nở.
* **Giai đoạn B - Nhập mã PIN**:
  * Trái tim mở ra ô hiển thị 4 chấm PIN phát sáng kèm bàn phím số cảm ứng đẹp mắt.
  * Có gợi ý nhỏ (ví dụ: *"Ngày kỷ niệm đặc biệt của chúng mình"* hoặc cấu hình linh hoạt trong `BIRTHDAY_CONFIG.secretPin`).
  * Nhập sai: 4 ô số rung nhẹ (shake animation) màu đỏ để nhập lại.
  * Nhập đúng: Màn hình bừng sáng thành luồng ánh sáng trắng lung linh và dẫn thẳng sang Cảnh Kết Thúc!

### Cảnh 8: Bông Hoa Nở Từ Từ & Lời Chúc Cuối (`finale_flower`)
* Màn hình chuyển vào không gian sao đêm lãng mạn.
* **Hiệu ứng Bông hoa nở (Blooming Flower)**:
  * Nụ hoa thanh thoát ở giữa màn hình.
  * Các lớp cánh hoa mềm mại từ từ xòe ra từng tầng theo chu kỳ 3-4 giây, uyển chuyển và sống động như một thước phim time-lapse nghệ thuật.
  * Nhụy hoa tỏa ra những hạt bụi vàng (golden glow particles) bồng bềnh.
* Phía trên bông hoa, lời chúc sinh nhật thiêng liêng nhất trôi lên uyển chuyển:
  * *"Happy Birthday, Bạn nhỏ của anh! 💖"*
  * *"Chúc cho mọi ước mơ của em đều trở thành hiện thực ✨"*
  * *"Yêu em nhiều hơn mỗi ngày ❤️"*
* Đại tiệc pháo hoa ngập tràn (`confetti` liên hoàn nhiều góc).
* Nút *"Quay lại từ đầu ↺"* nhỏ nhắn tinh tế ở dưới để người dùng có thể trải nghiệm lại từ đầu bất cứ lúc nào.

---

## 3. Kiến Trúc Kỹ Thuật (Technical Architecture)

### 3.1. Cấu trúc Thư Mục & File Thay Đổi
```
├── app/
│   ├── globals.css              # Thêm quy tắc khóa scroll tuyệt đối, animation hoa nở
│   ├── layout.tsx               # Giữ nguyên cấu hình font và metadata
│   └── page.tsx                 # Render SceneManager thay vì danh sách section dài
├── components/
│   ├── SceneManager.tsx         # [MỚI] Bộ điều phối cảnh chính, quản lý state và chuyển cảnh
│   ├── BackButton.tsx           # [MỚI] Nút lùi cảnh tinh tế ở góc trên trái
│   ├── TapIndicator.tsx         # [MỚI] Dòng gợi ý chạm nhấp nháy êm dịu
│   ├── IntroScene.tsx           # Refactor từ IntroSplash cho Framer Motion
│   ├── SweetWordsScene.tsx      # Từng câu chữ trôi êm theo tap
│   ├── GiftAndCakeScene.tsx     # [MỚI] Hợp nhất Hộp quà -> Bánh nhô lên -> Cắt bánh -> Mở quà 2 -> Thư tay
│   ├── FloatingMemoriesScene.tsx# [MỚI] Ảnh bay lần lượt từ hộp quà và trôi nổi + Điểm khám phá ẩn
│   ├── SecretPuzzleModal.tsx    # [MỚI] Modal Ghép tim + Bàn phím số mã PIN
│   ├── FinaleFlowerScene.tsx    # [MỚI] Bông hoa nở bằng SVG + Lời chúc cuối cùng
│   ├── Lightbox.tsx             # Tái sử dụng để xem chi tiết ảnh kỷ niệm
│   ├── ParticlesBg.tsx          # Giữ nguyên hạt bụi sao nền cố định
│   └── MusicPlayer.tsx          # Giữ nguyên trình phát nhạc cố định
├── hooks/
│   ├── useSceneNavigation.ts    # [MỚI] Hook quản lý logic chuyển cảnh, chặn cuộn, canAdvance
│   └── useMusicPlayer.ts        # Giữ nguyên
└── lib/
    └── constants.ts             # Thêm config mã PIN (secretPin), puzzleHint, flowerWish
```

### 3.2. Quản Lý State & Điều Hướng (`useSceneNavigation`)
```ts
export type SceneKey =
  | "intro"
  | "sweet_words"
  | "gift_flow"
  | "floating_memories"
  | "finale_flower";

interface SceneState {
  currentScene: SceneKey;
  subStep: number;           // Dùng cho câu chữ sweet_words hoặc các bước trong gift_flow
  canAdvance: boolean;       // Khóa tap khi đang trong mini-game hoặc đang animation
  isPuzzleOpen: boolean;     // Hiển thị modal câu đố bí mật
  history: { scene: SceneKey; subStep: number }[]; // Phục vụ nút Back
}
```

### 3.3. Khóa Hoàn Toàn Cuộn Trang (Zero Scroll)
* Trong `app/globals.css`:
  ```css
  html, body {
    overflow: hidden !important;
    height: 100dvh !important;
    width: 100vw !important;
    position: fixed;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
  }
  ```
* Trong `useSceneNavigation`:
  * Lắng nghe và chặn các sự kiện:
    * `wheel` ➔ `e.preventDefault()`
    * `touchmove` ➔ `e.preventDefault()` (ngoại trừ thao tác kéo dao cắt bánh và ghép tim)
    * `keydown` (ArrowUp, ArrowDown, PageUp, PageDown, Space) ➔ `e.preventDefault()`

### 3.4. Cấu Hình Biến Số Trong `lib/constants.ts`
```ts
export const BIRTHDAY_CONFIG = {
  // ... nội dung hiện có ...
  secretPin: "2002", // Mã PIN 4 số mặc định (dễ dàng thay đổi)
  secretPinHint: "Gợi ý: Năm sinh của bạn nhỏ ❤️",
  puzzleInstruction: "Ghép 2 mảnh trái tim lại với nhau nhé ✨",
  finaleFlower: {
    title: "Happy Birthday, Bạn nhỏ của anh! 💖",
    subtitle: "Chúc cho mọi ước mơ của em đều nở rộ rực rỡ như đóa hoa này ✨",
    closing: "Yêu em mãi mãi ❤️",
  },
};
```

---

## 4. Xử Lý Tình Huống Biên (Edge Cases) & Hiệu Năng

1. **Chạm nhầm khi đang xem ảnh phóng to (Lightbox)**: Khi modal `Lightbox` hoặc `SecretPuzzleModal` đang mở, sự kiện tap chuyển cảnh nền sẽ bị vô hiệu hóa hoàn toàn (`e.stopPropagation()`).
2. **Kéo dao cắt bánh & Kéo ghép tim**: Sử dụng pointer capture riêng biệt (`onPointerDown`, `onPointerMove`, `onPointerUp`) không kích hoạt sự kiện tap chuyển cảnh.
3. **Màn hình điện thoại kích thước nhỏ**:
   * Các ảnh polaroid bay ra từ hộp quà được tính toán tọa độ theo tỷ lệ viewport (%) để luôn nằm gọn trong khung nhìn, không bị tràn ra ngoài màn hình.
   * Bông hoa nở SVG sử dụng `viewBox` vector sắc nét ở mọi độ phân giải.
4. **Hiệu năng GPU**: Tất cả chuyển động dùng `framer-motion` với `transform` (GPU accelerated), `opacity` và `filter` tối ưu để đạt 60fps trên mobile.

---

## 5. Kế Hoạch Kiểm Thử (Verification Plan)

1. **Kiểm tra khóa cuộn**:
   * Dùng chuột cuộn trên PC ➔ Trang đứng yên, không dịch chuyển một pixel nào.
   * Vuốt cảm ứng trên mobile ➔ Không bị nảy trang hay cuộn.
2. **Kiểm tra luồng tap từng cảnh**:
   * Cảnh 1 ➔ Cảnh 2 (4 câu chữ) ➔ Hộp quà.
   * Hộp quà: Chạm vào nền khi chưa mở hộp ➔ Không nhảy cảnh (bị khóa tap). Mở hộp xong ➔ Bánh kem trồi lên.
   * Bánh kem: Cắt bánh xong ➔ Mở quà tiếp ➔ Thư tình hiện ra.
   * Đọc thư xong ➔ Ảnh kỷ niệm lần lượt bay ra từ hộp quà.
3. **Kiểm tra Khám phá ẩn & Câu đố**:
   * Chạm vào điểm bí mật ➔ Hiện popup Ghép tim.
   * Kéo ghép 2 nửa tim khít lại ➔ Mở bàn phím PIN.
   * Nhập sai PIN ➔ Rung lắc cảnh báo. Nhập đúng PIN ➔ Chuyển sang Cảnh Kết Thúc.
4. **Kiểm tra Bông hoa nở & Nút xem lại**:
   * Bông hoa nở mượt mà từ nụ thành hoa rực rỡ.
   * Bấm nút "Quay lại từ đầu" ➔ Trở về Cảnh 1 trơn tru.
5. **Kiểm tra nút Lùi lại (Back)**:
   * Bấm nút Back ở các cảnh ➔ Lùi lại chính xác câu/cảnh trước đó mà không gây lỗi state.
