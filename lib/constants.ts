export interface MemoryItem {
  src: string;
  type: "image" | "video";
  caption: string;
}

export const BIRTHDAY_CONFIG = {
  name: "Bạn nhỏ",

  sweetWords: [
    "Có những ngày, chỉ cần nghĩ đến em thôi là đủ vui rồi...",
    "Em là điều tuyệt vời nhất mà anh từng có...",
    "Sinh nhật em, anh muốn tặng em cả thế giới...",
    "Nhưng trước hết, mở quà anh đã nào! 🎁",
  ],

  letterContent: `Gửi Bạn nhỏ yêu dấu,

Hôm nay là ngày đặc biệt nhất trong năm — ngày em được sinh ra trên đời này. Và anh thật may mắn vì được ở bên em, được yêu em, được cùng em đi qua bao nhiêu kỷ niệm đẹp.

Em biết không, mỗi ngày bên em đều là một ngày tuyệt vời. Nụ cười của em, giọng nói của em, cả những lúc em giận dỗi nữa — tất cả đều khiến anh yêu em nhiều hơn.

Anh không giỏi nói những lời hoa mỹ, nhưng anh muốn em biết rằng: em là người quan trọng nhất trong cuộc đời anh. Anh sẽ luôn ở đây, bên em, dù bất cứ điều gì xảy ra.

Chúc em sinh nhật thật vui, thật hạnh phúc. Mong em luôn khỏe mạnh, luôn xinh đẹp, và luôn là em — người mà anh yêu nhất.

Yêu em nhiều lắm ❤️`,

  memories: [
    { src: "/images/photo1.jpg", type: "image" as const, caption: "Lần đầu tiên chúng mình gặp nhau..." },
    { src: "/images/photo2.jpg", type: "image" as const, caption: "Chuyến đi đáng nhớ nhất của mình" },
    { src: "/images/photo3.jpg", type: "image" as const, caption: "Khoảnh khắc anh yêu nhất" },
    { src: "/videos/video1.mp4", type: "video" as const, caption: "Video kỷ niệm của chúng mình" },
    { src: "/images/photo4.jpg", type: "image" as const, caption: "Ngày sinh nhật năm ngoái" },
    { src: "/images/photo5.jpg", type: "image" as const, caption: "Em luôn đẹp nhất khi cười" },
    { src: "/images/photo6.jpg", type: "image" as const, caption: "Yêu em nhiều lắm ❤️" },
  ],

  // Secret Puzzle & Finale Config
  secretPin: "2002",
  secretPinHint: "Gợi ý: Năm sinh của bạn nhỏ ❤️",
  puzzleInstruction: "Chạm để gắn kết 2 mảnh tim lại với nhau nhé ✨",
  finaleFlower: {
    badge: "Special Birthday Wish",
    title: "Happy Birthday, Bạn nhỏ của anh! 💖",
    subtitle: "Chúc cho mọi ước mơ của em đều nở rộ rực rỡ như đóa hoa này ✨",
    closing: "Yêu em nhiều hơn mỗi ngày ❤️",
  },
} as const;
