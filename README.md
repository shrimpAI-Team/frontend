# 💻 shrimpAI • Client Web Application

<p align="center">
  <img src="https://img.shields.io/badge/Module-Client%20Portal-06b6d4?style=for-the-badge&logo=react&logoColor=white" alt="Client Portal" />
  <img src="https://img.shields.io/badge/Port-5174-38bdf8?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Port 5174" />
  <img src="https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS 4" />
  <img src="https://img.shields.io/badge/Zustand-State%20Store-4338ca?style=for-the-badge&logo=redux&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Vite-8.2-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
</p>

---

## 📌 Tổng Quan (Overview)

**`frontend`** là ứng dụng web tương tác trực tiếp dành cho **Người Nuôi Tôm, Kỹ Sư Thủy Sản và Khách Hàng**. Ứng dụng cung cấp các công cụ trực quan để nhận diện giống tôm bằng AI, tư vấn kỹ thuật nuôi thông qua trợ lý ảo chuyên gia, quản lý lịch sử kiểm tra và bảo mật tài khoản cá nhân cấp ngân hàng.

Mặc định chạy tại địa chỉ: **`http://localhost:5174`**.

---

## ✨ Tính Năng Nổi Bật (Key Features)

### 1. 🦐 Bàn Quét Nhận Dạng Giống Tôm (AI Vision Scanner)
- **Tải ảnh linh hoạt**: Kéo thả ảnh mẫu từ máy tính hoặc chụp ảnh trực tiếp từ camera điện thoại/laptop.
- **Phân tích hình thái học tức thì**:
  - Nhận diện phân loại giống tôm (Tôm thẻ chân trắng, Tôm sú, Tôm càng xanh,...).
  - Đánh giá chỉ số độ tin cậy của thuật toán (*Confidence Score*).
  - Ước tính kích thước hình thái (chiều dài cơ thể, tương quan khối lượng).
  - Ghi nhận lịch sử kiểm tra vào hồ sơ người dùng.

### 2. 💬 Trợ Lý Ảo Chuyên Gia Thủy Sản (AI Assistant Chat)
- **Hội thoại thông minh thời gian thực**: Trợ lý ảo được huấn luyện theo tri thức nuôi tôm thương phẩm công nghệ cao.
- **Hỗ trợ đa chủ đề**: Xử lý chất lượng nước (pH, kiềm, oxy hòa tan, khí độc $NH_3/NO_2$), quản lý thức ăn, phòng trị các bệnh phổ biến (đốm trắng, đầu vàng, hoại tử gan tụy cấp AHPND, EHP).
- **Lưu trữ phiên chat**: Lưu trữ lịch sử từng chủ đề hội thoại để người dùng xem lại bất cứ lúc nào.

### 3. 🛡️ Hệ Thống Bảo Mật & Xác Thực Cấp Doanh Nghiệp
- **Đa phương thức đăng nhập**: Hỗ trợ đăng nhập truyền thống (Email/Mật khẩu) và Đăng nhập một chạm qua **Google OAuth2** / **Facebook**.
- **Xác thực hai bước (2FA TOTP)**: Quét mã QR để kích hoạt Google Authenticator / Microsoft Authenticator, bảo vệ tài khoản khỏi tấn công chiếm quyền.
- **Xác thực Email**: Gửi mã OTP xác nhận tài khoản qua email thực tế.
- **Quản lý thiết bị & Phiên làm việc**: Cho phép xem danh sách tất cả thiết bị/trình duyệt đang đăng nhập vào tài khoản và chủ động bấm "Đăng xuất thiết bị khác".

---

## 🛠️ Ngăn Xếp Công Nghệ (Tech Stack)

| Hạng mục | Công nghệ sử dụng | Mục đích & Ưu điểm |
| :--- | :--- | :--- |
| **Framework Core** | **React 19** | Rendering UI hiện đại nhất, hỗ trợ React Server Components ready |
| **Build Tool** | **Vite 8** | Tốc độ Hot Module Replacement (HMR) tính bằng mili-giây |
| **Styling** | **TailwindCSS 4** | Engine CSS thế hệ mới, biên dịch siêu tốc, tối ưu hóa bundle size |
| **State Management**| **Zustand 5** | Quản lý state nhẹ (Auth, Chat, Scanner), không boilerplate rườm rà |
| **Routing** | **React Router 7** | Điều hướng Single Page Application (SPA) mượt mà |
| **HTTP Client** | **Axios** | Interceptor tự động gắn JWT Bearer token và xử lý lỗi đồng bộ |
| **Ngôn ngữ** | **TypeScript 6** | Đảm bảo tính nhất quán dữ liệu (Type-Safe) từ API đến UI |

---

## 📁 Cấu Trúc Thư Mục (Directory Layout)

```text
frontend/
├── public/                 # Static assets, favicon, logo
├── src/
│   ├── api/                # Cấu hình API Client & định nghĩa Request/Response
│   │   ├── auth.api.ts     # Login, Register, 2FA, OAuth, Forgot Password
│   │   ├── chat.api.ts     # Gửi tin nhắn, tạo phiên chat, xóa phiên chat
│   │   ├── species.api.ts  # API suy luận hình ảnh tôm & danh mục giống
│   │   └── user.api.ts     # Lấy thông tin cá nhân, cập nhật profile, danh sách phiên
│   │
│   ├── components/         # Các thành phần giao diện tái sử dụng
│   │   ├── auth/           # Form đăng nhập, đăng ký, modal QR 2FA
│   │   ├── chat/           # Hộp chat, danh sách tin nhắn, gợi ý câu hỏi
│   │   ├── layout/         # Navbar, Footer, Mobile Drawer Navigation
│   │   ├── scanner/        # Khung kéo thả ảnh, bảng kết quả phân tích AI
│   │   └── ui/             # Button, Badge, Modal, Input, Spinner
│   │
│   ├── pages/              # Các trang chính của ứng dụng
│   │   ├── LandingPage.tsx # Trang giới thiệu giải pháp & công nghệ
│   │   ├── ScannerPage.tsx # Bàn phân tích & chẩn đoán tôm AI
│   │   ├── ChatPage.tsx    # Giao diện trò chuyện chuyên gia tôm
│   │   ├── LoginPage.tsx   # Trang đăng nhập
│   │   ├── RegisterPage.tsx# Trang đăng ký
│   │   ├── ProfilePage.tsx # Hồ sơ cá nhân & cài đặt bảo mật 2FA
│   │   └── ForgotPass.tsx  # Khôi phục mật khẩu qua Email OTP
│   │
│   ├── store/              # Quản lý trạng thái ứng dụng bằng Zustand
│   │   ├── auth.store.ts   # Lưu trữ User Token, Profile, trạng thái 2FA
│   │   └── chat.store.ts   # Quản lý danh sách phiên chat và tin nhắn active
│   │
│   ├── App.tsx             # Định nghĩa danh mục Routes chính
│   ├── main.tsx            # Entry point khởi tạo React DOM
│   └── index.css           # Cấu hình TailwindCSS directives & Custom utilities
│
├── .env.example            # Mẫu biến môi trường
├── package.json            # Danh sách dependencies
├── tsconfig.json           # Cấu hình TypeScript
└── vite.config.ts          # Cấu hình máy chủ Vite (Port 5174)
```

---

## ⚙️ Biến Môi Trường (.env)

Tạo file `frontend/.env`:

```env
# Địa chỉ máy chủ Backend API Gateway
VITE_API_URL="http://localhost:4000"

# Đường dẫn chuyển tiếp sang Cổng Quản trị (Dành cho Quản trị viên)
VITE_ADMIN_PORTAL_URL="http://localhost:5175"
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

Truy cập trình duyệt tại: **`http://localhost:5174`**

### Các lệnh hữu ích khác:
- `npm run build`: Kiểm tra kiểu dữ liệu TypeScript và đóng gói ứng dụng thành phẩm vào thư mục `dist/`.
- `npm run preview`: Chạy thử bản build thành phẩm trên máy chủ cục bộ.
- `npm run lint`: Kiểm tra chất lượng mã nguồn theo tiêu chuẩn ESLint.
