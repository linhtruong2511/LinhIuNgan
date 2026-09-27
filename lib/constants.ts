export interface MemoryItem {
  src: string;
  type: "image" | "video";
  caption: string;
}

export const BIRTHDAY_CONFIG = {
  name: "Bạn nhỏ",

  sweetWords: [
    "Cảm ơn em vì đã luôn ở bên cạnh anh...",
    "Hôm nay là một ngày thật đặc biệt, ngày dành riêng cho em...",
    "Anh muốn mang lại những điều tuyệt vời nhất cho em...",
    "Đoán xem hôm nay anh có bất ngờ gì cho em nè!"
  ],

  letterContent: `Gửi Bạn nhỏ của anh,

Hôm nay là ngày đặc biệt nhất trong năm — ngày mà người anh yêu xuất hiện trên cuộc đời này. Tiếc là sinh nhật năm nay anh không thể ở ngay cạnh để thổi nến và ôm em một cái thật chặt, nhưng mọi suy nghĩ của anh hôm nay đều hướng về nơi em.

Ơ nơi đó chắc chắn có những lúc mệt mỏi và cô đơn, nhưng em đã luôn mạnh mẽ và làm rất tốt rồi. Anh tự hào về em nhiều lắm. Dù hai đứa đang ở hai nơi khác nhau, khoảng cách chỉ là địa lý thôi, còn góc nhỏ bình yên nhất trong lòng anh thì lúc nào cũng dành trọn cho em.

Chúc Bạn nhỏ sinh nhật thật nhiều niềm vui và luôn bình an. Mong em chăm sóc bản thân thật tốt, ăn uống đầy đủ, và hãy nhớ rằng dù ở đâu, anh vẫn luôn đứng phía sau ủng hộ và chờ ngày gặp lại em.

Thương và nhớ em rất nhiều ❤️`,

  memories: [
    { src: "/images/photo9.jpg", type: "image" as const, caption: "Chũng mình đi chụp photobooth" },
    { src: "/images/photo2.jpg", type: "image" as const, caption: "Bức ảnh em khoe anh hôm chúng mình cùng về tranh thủ" },
    { src: "/images/photo3.jpg", type: "image" as const, caption: "Hôm chúng mình đi chơi nè" },
    { src: "/images/photo11.jpg", type: "image" as const, caption: "Chúng mình chuẩn bị về hè" },
    { src: "/images/photo24.jpg", type: "image" as const, caption: "Trông iu quá cơ :>" },
    { src: "/images/photo5.jpg", type: "image" as const, caption: "Bức này là hôm em đang đi làm giấy tờ, chúng mình chuẩn bị yêu xa" },
    { src: "/images/photo7.jpg", type: "image" as const, caption: "Bạn nhỏ của anh cute quá zọ ❤️" },
  ],

  // Secret Puzzle & Finale Config
  secretPin: "3004",
  secretPinHint: "Gợi ý: Ngày chúng mình chính thức yêu nhau",
  puzzleInstruction: "Kéo từng mảnh ghép vào đúng vị trí nhé ✨",
  finaleFlower: {
    badge: "Special Birthday Wish",
    title: "Happy Birthday, Bạn nhỏ của anh! 💖",
    subtitle: "Chúc cho mọi ước mơ của em đều nở rộ rực rỡ như đóa hoa này ✨",
    closing: "Yêu em nhiều hơn mỗi ngày ❤️",
  },
} as const;
