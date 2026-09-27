# Thiết Kế: Thử Thách Kéo Thả Trái Tim & Gợi Ý Mật Mã Động

## 1. Mục tiêu
Nâng cấp trải nghiệm tương tác trong `SecretPuzzleModal`:
1. **Thử thách Trái Tim**: Chuyển từ bấm chạm (tap) sang kéo thả (drag & drop) 2 nửa trái tim vào đúng khung mục tiêu ở giữa, kéo từng mảnh một.
2. **Mã Khóa Trái Tim**: Ban đầu ẩn dòng gợi ý mật mã. Chỉ khi người dùng nhập sai mới hiển thị: `"Gợi ý: Ngày chúng mình chính thức yêu nhau"`.

## 2. Chi tiết Giải pháp

### 2.1. Thử thách Kéo Thả Trái Tim (`match_heart`)
- **Bố cục giao diện**:
  - Tiêu đề: "Thử Thách Tình Yêu ✨"
  - Phụ đề hướng dẫn: "Kéo từng mảnh ghép vào đúng vị trí nhé ✨"
  - Vùng kéo thả trung tâm:
    - Ở chính giữa là một silhouette khung trái tim mờ (viền đứt/glow nhẹ) chia 2 nửa trái và phải.
    - Ban đầu, mảnh tim trái đặt lệch sang bên trái (`x: -65px`).
    - Mảnh tim phải đặt lệch sang bên phải (`x: +65px`).
- **Cơ chế Kéo Thả (Framer Motion `drag`)**:
  - Hoạt động mượt mà trên cả máy tính (chuột) và điện thoại (cảm ứng/pointer events).
  - Quản lý trạng thái: `isLeftLocked` và `isRightLocked`.
  - Khi chưa khóa:
    - Cho phép kéo tự do mảnh đó (`drag={!isLeftLocked}`).
    - Khi kéo (`whileDrag`): tăng kích thước nhẹ (`scale: 1.08`), tăng `zIndex` và độ bóng (glow).
  - Khi nhả tay (`onDragEnd`):
    - Đánh giá khoảng cách kéo tới vị trí mục tiêu ở tâm (nửa trái cần dịch sang phải ~65px, nửa phải cần dịch sang trái ~65px).
    - Nếu độ lệch nằm trong phạm vi bắt dính (threshold ~40px):
      - Đặt `isLeftLocked = true` (hoặc `isRightLocked = true`).
      - Mảnh tim tự động hít (snap) chính xác vào vị trí mục tiêu ở giữa khung tim và khóa lại.
      - Phát hiệu ứng tia sáng / rung nhẹ.
    - Nếu thả ngoài vùng đích:
      - Tự động trượt (spring animation) trở về vị trí bắt đầu ban đầu.
  - Khi cả hai mảnh đều được ghép vào vị trí (`isLeftLocked && isRightLocked`):
    - Kích hoạt hiệu ứng hợp nhất trái tim: nhịp đập phập phồng (heartbeat pulse), phát sáng viền.
    - Bắn pháo hoa rực rỡ (`canvas-confetti`).
    - Cập nhật thông báo: `"Trái tim đã hòa làm một ❤️"`.
    - Sau 900ms, tự động chuyển tiếp sang bước nhập mã PIN (`enter_pin`).

### 2.2. Mã Khóa Trái Tim (`enter_pin`)
- **Trạng thái khởi tạo**:
  - Không hiển thị bất kỳ dòng gợi ý nào (bỏ dòng gợi ý mặc định ban đầu).
  - Giao diện gọn gàng với tiêu đề: "Mã Khóa Trái Tim 🔐", 4 chấm ký tự PIN và bàn phím số (0-9, Xóa).
- **Trạng thái khi nhập sai**:
  - Khi nhập đủ 4 số mà không trùng với `secretPin` (`3004`):
    - 4 chấm mã số rung lắc (`animate-shake`) và chuyển màu đỏ.
    - Xóa các ký tự đã nhập sau 300ms để người dùng nhập lại.
    - Bật cờ `showHint = true`.
  - Khi `showHint = true`:
    - Hiển thị dòng chữ gợi ý với animation fade-in:
      `"Gợi ý: Ngày chúng mình chính thức yêu nhau"`
    - Màu chữ nổi bật và ấm áp (màu vàng kem / hồng nhạt).
    - Gợi ý tiếp tục được giữ nguyên trên màn hình cho các lần nhập tiếp theo.
- **Trạng thái khi nhập đúng**:
  - Pháo hoa giấy confetti nổ rực rỡ và gọi `onSuccess()` chuyển sang phần quà tiếp theo.

## 3. Các file sẽ chỉnh sửa
- `lib/constants.ts`: Cập nhật text hướng dẫn puzzle và nội dung gợi ý mã PIN.
- `components/SecretPuzzleModal.tsx`: Tái cấu trúc logic kéo thả mảnh tim bằng Framer Motion và quản lý hiển thị gợi ý sau khi nhập sai.
