import { create } from "zustand";

export type Language = "vi" | "en";

export const translations = {
  vi: {
    // Navigation
    home: "Trang chủ",
    analysis: "Phân tích tôm",
    history: "Lịch sử",
    about: "Giới thiệu",
    admin: "Quản trị",
    startAnalysis: "Bắt đầu phân tích",
    profile: "Hồ sơ",
    security: "Bảo mật",
    logout: "Đăng xuất",
    userRole: "Người dùng",
    adminRole: "Quản trị viên",
    darkTheme: "Tối",
    lightTheme: "Sáng",
    adminPortal: "Admin Portal ↗",
    openMenu: "Mở menu",

    // Dashboard
    heroBadge: "Công nghệ Vision AI Thế hệ mới",
    heroTitle: "Hệ thống Nhận diện & Giám định Giống tôm",
    heroSubtitle:
      "Ứng dụng Trí tuệ Nhân tạo YOLOv8 & Computer Vision hỗ trợ bà con nông dân và doanh nghiệp thủy sản định danh chính xác, nhanh chóng.",
    scanNowBtn: "Quét giống tôm ngay",
    viewHistoryBtn: "Xem lịch sử phân tích",
    supportedSpeciesTitle: "Danh mục các giống tôm hỗ trợ",
    supportedSpeciesSubtitle:
      "Mô hình được huấn luyện đặc biệt cho các giống tôm phổ biến tại Việt Nam",
    recentScansTitle: "Lịch sử giám định gần đây",
    noHistoryText: "Chưa có lượt quét nào. Hãy bấm 'Bắt đầu phân tích' để thử ngay!",
    timeJustNow: "vừa xong",
    accuracyTop: "Độ chính xác cao",
    liveCameraReady: "Sẵn sàng quét qua Camera",
    fastInference: "Phản hồi dưới 0.1s",

    // Analysis Modal (Scanner)
    scannerTitle: "Nhận diện & Phân loại giống tôm AI",
    scannerSubtitle:
      "Tải lên ảnh hoặc chụp trực tiếp để hệ thống AI Vision phân tích tức thì",
    uploadTab: "Tải ảnh lên",
    cameraTab: "Chụp từ Camera",
    quickSamples: "Hoặc chọn ảnh mẫu thử nghiệm nhanh:",
    dragDropText: "Kéo thả ảnh vào đây, hoặc",
    browseFile: "duyệt file từ máy",
    analyzing: "Đang phân tích hình thái...",
    startScanBtn: "Phân tích giống tôm này",
    changeImage: "Đổi ảnh khác",
    resultTitle: "Kết quả giám định AI",
    confidence: "Độ tin cậy",
    scientificName: "Tên khoa học",
    commercialGrade: "Chuẩn phân loại",
    sizeEstimate: "Kích cỡ ước tính",
    biologicalDescription: "Đặc điểm sinh học nhận dạng",
    reScan: "Quét ảnh khác",
    saveHistory: "Đã lưu vào lịch sử",
    capturePhoto: "Chụp ảnh này",
    switchCamera: "Đổi Camera",
    cameraPermissionErr: "Không thể truy cập camera. Vui lòng cấp quyền máy ảnh trên trình duyệt.",

    // Chat Page
    chatTitle: "Trợ lý AI Thủy sản",
    chatSubtitle:
      "Tư vấn kỹ thuật nuôi, nhận dạng giống và bệnh lý trên tôm 24/7",
    chatPlaceholder:
      "Hỏi trợ lý AI về kỹ thuật nuôi, nhận biết giống tôm, dịch bệnh...",
    sendBtn: "Gửi",
    clearChat: "Làm mới hội thoại",
    botWelcome:
      "Xin chào! Tôi là Trợ lý AI chuyên ngành tôm thủy sản. Bạn cần hỗ trợ gì về kỹ thuật nuôi, môi trường nước hay nhận dạng giống tôm hôm nay?",

    // Auth Pages
    loginTitle: "Đăng nhập",
    loginSubtitle: "Truy cập tài khoản của bạn một cách an toàn",
    emailLabel: "Email",
    passwordLabel: "Mật khẩu",
    loginBtn: "Đăng nhập",
    registerTitle: "Đăng ký tài khoản",
    registerSubtitle: "Trải nghiệm hệ thống nhận diện tôm thông minh",
    nameLabel: "Họ và tên",
    registerBtn: "Tạo tài khoản",
    hasAccount: "Đã có tài khoản?",
    noAccount: "Chưa có tài khoản?",
    signInNow: "Đăng nhập ngay",
    registerNow: "Đăng ký ngay",
    orSocial: "Hoặc đăng nhập bằng",

    // Profile & Security
    profileTitle: "Hồ sơ cá nhân",
    profileSubtitle: "Quản lý thông tin tài khoản và tùy chọn cá nhân",
    saveChanges: "Lưu thay đổi",
    securityTitle: "Bảo mật & Phiên đăng nhập",
    securitySubtitle: "Cấu hình xác thực 2 bước (2FA) và quản lý thiết bị",
    twoFactorStatus: "Xác thực hai yếu tố (2FA)",
    activeSessions: "Các thiết bị đang đăng nhập",

    // Species
    the_chan_trang: "Tôm thẻ chân trắng",
    tom_su: "Tôm sú",
    tom_cang_xanh: "Tôm càng xanh",
    tom_hum: "Tôm hùm",
  },

  en: {
    // Navigation
    home: "Home",
    analysis: "Shrimp Analysis",
    history: "History",
    about: "About Us",
    admin: "Admin",
    startAnalysis: "Start Analysis",
    profile: "Profile",
    security: "Security",
    logout: "Sign Out",
    userRole: "User",
    adminRole: "Administrator",
    darkTheme: "Dark",
    lightTheme: "Light",
    adminPortal: "Admin Portal ↗",
    openMenu: "Open menu",

    // Dashboard
    heroBadge: "Next-Gen Vision AI Technology",
    heroTitle: "AI Shrimp Breed Recognition & Inspection",
    heroSubtitle:
      "Applying YOLOv8 & Computer Vision to empower farmers and aquaculture enterprises with instant, high-precision species grading.",
    scanNowBtn: "Scan Shrimp Now",
    viewHistoryBtn: "View History",
    supportedSpeciesTitle: "Supported Shrimp Species",
    supportedSpeciesSubtitle:
      "Models specially trained for popular commercial shrimp breeds in Vietnam",
    recentScansTitle: "Recent Inspection History",
    noHistoryText: "No scan history yet. Click 'Start Analysis' to try now!",
    timeJustNow: "just now",
    accuracyTop: "High Accuracy",
    liveCameraReady: "Live Camera Scanning Ready",
    fastInference: "Sub-0.1s Response",

    // Analysis Modal (Scanner)
    scannerTitle: "AI Shrimp Species Identification",
    scannerSubtitle:
      "Upload a photo or capture live to analyze with AI Vision instantly",
    uploadTab: "Upload Photo",
    cameraTab: "Live Camera",
    quickSamples: "Or choose a quick test sample:",
    dragDropText: "Drag & drop image here, or",
    browseFile: "browse from device",
    analyzing: "Analyzing morphology...",
    startScanBtn: "Analyze This Shrimp",
    changeImage: "Change Photo",
    resultTitle: "AI Inspection Result",
    confidence: "Confidence",
    scientificName: "Scientific Name",
    commercialGrade: "Commercial Grade",
    sizeEstimate: "Estimated Size",
    biologicalDescription: "Biological Identification Notes",
    reScan: "Scan Another",
    saveHistory: "Saved to History",
    capturePhoto: "Capture Photo",
    switchCamera: "Switch Camera",
    cameraPermissionErr: "Unable to access camera. Please allow camera permissions in your browser.",

    // Chat Page
    chatTitle: "Aquaculture AI Assistant",
    chatSubtitle:
      "24/7 technical consultation on farming techniques, breeds, and diseases",
    chatPlaceholder:
      "Ask AI about water management, farming methods, shrimp breeds...",
    sendBtn: "Send",
    clearChat: "New Chat",
    botWelcome:
      "Hello! I am your Aquaculture AI Assistant. How can I assist you with farming techniques, water quality, or shrimp breed identification today?",

    // Auth Pages
    loginTitle: "Sign In",
    loginSubtitle: "Access your account securely",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginBtn: "Sign In",
    registerTitle: "Create an Account",
    registerSubtitle: "Experience the intelligent shrimp vision platform",
    nameLabel: "Full Name",
    registerBtn: "Create Account",
    hasAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    signInNow: "Sign In",
    registerNow: "Sign Up",
    orSocial: "Or continue with",

    // Profile & Security
    profileTitle: "Personal Profile",
    profileSubtitle: "Manage your account details and preferences",
    saveChanges: "Save Changes",
    securityTitle: "Security & Sessions",
    securitySubtitle: "Configure Two-Factor Authentication (2FA) and manage devices",
    twoFactorStatus: "Two-Factor Authentication (2FA)",
    activeSessions: "Active Login Sessions",

    // Species
    the_chan_trang: "Whiteleg Shrimp",
    tom_su: "Black Tiger Shrimp",
    tom_cang_xanh: "Giant Freshwater Prawn",
    tom_hum: "Spiny Lobster",
  },
};

export type TranslationKey = keyof typeof translations.vi;

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  initLang: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
  lang: "vi",

  setLang: (lang: Language) => {
    localStorage.setItem("app.lang", lang);
    document.documentElement.setAttribute("lang", lang);
    set({ lang });
  },

  toggleLang: () => {
    const next = get().lang === "vi" ? "en" : "vi";
    get().setLang(next);
  },

  initLang: () => {
    const saved = localStorage.getItem("app.lang") as Language | null;
    if (saved === "vi" || saved === "en") {
      get().setLang(saved);
    } else {
      get().setLang("vi");
    }
  },

  t: (key: TranslationKey, fallback?: string) => {
    const current = get().lang;
    return translations[current]?.[key] ?? fallback ?? (key as string);
  },
}));
