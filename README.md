# HỒ SƠ #1983 — Web Game Thuyết Trình Ngữ Văn (Neon Noir / Cyber-Detective)

Web game tương tác thuyết trình Ngữ văn chuẩn máy chiếu, xây dựng bằng **React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Web Audio API**.

Bộ dữ liệu mẫu hiện tại áp dụng tác phẩm ***Chiếc Thuyền Ngoài Xa*** (*Nguyễn Minh Châu*). Để đổi sang tác phẩm khác, chỉ cần chỉnh sửa duy nhất file `src/data/gameData.ts`.

## Cài đặt & Chạy Local

```bash
npm install
npm run dev
```

## Build Production & Deploy (Vercel / Netlify / GitHub Pages)

```bash
npm run build
npm run preview
```

- **Vercel / Netlify:** Import repository, Build Command là `npm run build`, Output Directory là `dist`.
- **GitHub Pages:** Đã cấu hình `base: './'` trong `vite.config.ts`, có thể deploy trực tiếp thư mục `dist/`.

## Phím tắt & Bí mật dành cho Host

- `Enter`: Bắt đầu game / Xác nhận điền từ / Thu thập manh mối & đi tiếp
- `H`: Mở hoặc ẩn Gợi ý (Hint)
- `M`: Bật / Tắt hiệu ứng âm thanh tổng hợp (Web Audio API)
- **Easter Egg #1 (Chặng 3 trở đi):** Click vào biểu tượng kính lúp phát sáng tinh tế `0x83` ở góc trên bên phải của **Bản đồ hành trình (`StageMap`)** → Mở mẩu chuyện hậu trường & Hồi +1 Mạng (hoặc kích hoạt Khiên Bảo Vệ Neon nếu đang đầy 5/5 HP).
- **Easter Egg #2 (Chặng 6):** Nhấn tổ hợp phím `Shift + E` hoặc click vào nút glitch `FILE_ERR [Shift+E]` trên thẻ câu hỏi Chặng 6 → Kích hoạt hiệu ứng glitch neon & mở khóa "Hồ sơ mật / Góc nhìn phản biện bất ngờ".
