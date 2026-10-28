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

    // Dashboard Hero & Stats
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

    // Dashboard Features Section
    featuresBadge: "TÍNH NĂNG NỔI BẬT",
    featuresTitle: "Phân tích thông minh từ hình ảnh",
    featuresSubtitle:
      "Ứng dụng công nghệ AI để giúp bạn nhận dạng, phân loại và quản lý thông tin về các giống tôm một cách nhanh chóng, chính xác và hiệu quả.",
    feat1Title: "Nhận dạng giống tôm",
    feat1Desc:
      "Phân biệt chính xác các giống tôm phổ biến như: tôm thẻ chân trắng, tôm sú, tôm càng xanh, tôm hùm...",
    feat2Title: "Phân loại bằng AI",
    feat2Desc:
      "Sử dụng mô hình học sâu (Deep Learning) để đạt độ chính xác cao trong việc phân loại.",
    feat3Title: "Lưu lịch sử phân tích",
    feat3Desc:
      "Lưu trữ kết quả và hình ảnh để theo dõi, tra cứu và quản lý dễ dàng.",

    // Dashboard Live Demo & Steps
    demoBadge: "TRẢI NGHIỆM NGAY",
    demoTitle: "Phân tích tôm chỉ với vài bước",
    demoSubtitle:
      "Tải lên hình ảnh tôm, hệ thống sẽ tự động xử lý và trả về kết quả nhận dạng giống tôm cùng độ tin cậy.",
    demoDrag: "Kéo thả ảnh vào đây",
    demoOr: "hoặc",
    demoChoose: "Chọn ảnh từ máy",
    demoFormats: "Hỗ trợ: JPG, PNG, WEBP | Dung lượng tối đa: 10MB",
    analysisInfo: "Thông tin phân tích",
    shrimpSpecies: "Loài tôm",
    analysisTime: "Thời gian phân tích",
    imageSize: "Kích thước ảnh",
    demoNote:
      "Kết quả được dựa trên mô hình AI và có thể thay đổi tùy theo chất lượng hình ảnh.",
    stepsBadge: "QUY TRÌNH HOẠT ĐỘNG",
    stepsTitle: "Chỉ 3 bước đơn giản",
    stepsSubtitle:
      "Hệ thống shrimpAI tự động hoá toàn bộ quy trình từ tải ảnh, xử lý dữ liệu thị giác đến trả kết quả định danh tức thì.",
    step1Badge: "Tải dữ liệu",
    step1Title: "1. Tải ảnh tôm",
    step1Desc:
      "Tải lên ảnh chụp rõ nét tôm thương phẩm hoặc chụp trực tiếp tại bờ ao bằng camera di động.",
    step1Ready: "Sẵn sàng",
    step1Action: "Trải nghiệm tải ảnh ngay",
    step2Badge: "AI Vision",
    step2Title: "2. AI phân tích",
    step2Desc:
      "Mô hình AI đa tầng bóc tách cấu trúc vỏ, gai chủy, cuống mắt và phân tích hình thái học độ chính xác cao.",
    step2Action: "Xem mô phỏng quét AI",
    step3Badge: "✓ Độ tin cậy 96.8%",
    step3Title: "3. Nhận kết quả",
    step3Desc:
      "Nhận kết quả định danh giống tôm, tên khoa học, độ tin cậy và lưu tự động vào lịch sử phân tích.",
    step3Action: "Xem chi tiết báo cáo",

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
    cameraPermissionErr:
      "Không thể truy cập camera. Vui lòng cấp quyền máy ảnh trên trình duyệt.",

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

    // About Us Page
    aboutHeroBadge: "TỔNG QUAN HỆ THỐNG • shrimpAI VISION PLATFORM",
    aboutHeroTitle: "Hệ thống nhận dạng & phân loại tôm bằng xử lý ảnh và Trí tuệ nhân tạo (AI)",
    aboutHeroSubtitle:
      "Giải pháp công nghệ thị giác máy tính hỗ trợ người nuôi tôm, trang trại và cơ sở thu mua nhận diện giống tôm, đo kích thước, đánh giá độ đồng đều và cảnh báo bất thường nhanh chóng qua ảnh chụp từ điện thoại hoặc camera.",
    aboutExploreBtn: "Trải nghiệm phân tích tôm",
    aboutBackHome: "Về Trang chủ",
    aboutProjectSignificance: "Ý NGHĨA DỰ ÁN",
    aboutSignificanceTitle: "Hiện đại hóa giám sát thủy sản bằng Công nghệ số",
    aboutSignificanceP1:
      "Trong nuôi tôm truyền thống, việc kiểm tra kích cỡ, đánh giá thể trạng và phân loại tôm thường thực hiện thủ công bằng mắt thường hoặc bắt mẫu cân đo. Phương pháp này không chỉ tốn nhiều công sức mà còn dễ gây trầy xước, sốc cho tôm và phụ thuộc lớn vào cảm quan chủ quan.",
    aboutSignificanceQuote:
      '"Đề tài nhằm xây dựng hệ thống phần mềm hỗ trợ nhận dạng và phân loại tôm thông qua hình ảnh chụp từ điện thoại hoặc camera. Sử dụng kỹ thuật xử lý ảnh và AI để nhận diện đối tượng tôm, hỗ trợ phân loại theo loại tôm, kích thước, màu sắc, mức độ đồng đều hoặc một số dấu hiệu bất thường bên ngoài."',
    aboutSignificanceAuthor: "— Nghiên cứu & phát triển shrimpAI",
    aboutSignificanceP2:
      "Kết quả phân tích được lưu trữ an toàn vào cơ sở dữ liệu và hiển thị trực quan trên giao diện Web App / Mobile App, giúp người quản lý ao dễ dàng theo dõi, thống kê và đưa ra quyết định kịp thời cho từng đợt thu hoạch.",
    aboutTechPlatform: "NỀN TẢNG CÔNG NGHỆ",
    aboutPillarsTitle: "4 Trụ cột tính năng cốt lõi",
    aboutPillarsSubtitle:
      "Kết hợp sức mạnh giữa thuật toán xử lý ảnh số và mạng nơ-ron học sâu để chuẩn hóa quy trình phân tích tôm.",
    aboutCriteriaBadge: "TIÊU CHÍ ĐÁNH GIÁ THỰC TẾ",
    aboutCriteriaTitle: "Các chỉ tiêu nhận dạng & phân loại tôm",
    aboutCriteriaTag: "Định chuẩn theo thực tế thị trường",
    aboutAppsBadge: "HỆ THỐNG TRIỂN KHAI THỰC TẾ",
    aboutAppsTitle: "Khả năng ứng dụng & Đối tượng sử dụng",
    aboutAppsSubtitle:
      "Sản phẩm dự kiến gồm Web App quản trị trung tâm, Mobile App di động và Trạm camera kiểm định tốc độ cao.",
    aboutCtaBadge: "Sẵn sàng thử nghiệm",
    aboutCtaTitle: "Bắt đầu kiểm định hình ảnh tôm cùng shrimpAI",
    aboutCtaSubtitle:
      "Tải ảnh lên hoặc chụp ảnh trực tiếp để hệ thống AI phân tích kích thước, nhận diện giống loài và trả báo cáo chi tiết.",
    aboutCtaBtn: "Phân tích tôm ngay",

    // Stats Bar
    statVisionTitle: "AI Vision",
    statVisionDesc: "Công nghệ xử lý ảnh hiện đại",
    statConfidenceTitle: "96.8%",
    statConfidenceDesc: "Độ chính xác cao",
    statAnalysisTitle: "Phân tích hình ảnh",
    statAnalysisDesc: "Nhanh chóng, chính xác",
    statInstantTitle: "Kết quả tức thì",
    statInstantDesc: "Tiết kiệm thời gian",

    // Dashboard Extras
    identifiedStatus: "Đã nhận dạng",
    uploadShrimpSample: "Tải ảnh",
    dragOrUpload: "Kéo thả hoặc tải từ máy",
    demoSampleTime: "12.4 giây",
    footerDesc: "Hệ thống nhận dạng và phân loại tôm bằng xử lý ảnh và AI",
    footerCopyright: "© 2026 shrimpAI Team. All rights reserved.",

    // About Scanner Card
    scannerCardActive: "Hoạt động",
    scannerTarget: "Mục tiêu",
    modelLabel: "Mô hình phân tích:",
    modelVal: "YOLOv8 + ResNet Classifier",
    speedLabel: "Tốc độ xử lý:",
    speedVal: "0.24 giây / mẫu",
    deviceLabel: "Thiết bị hỗ trợ:",
    deviceVal: "Smartphone, PC, Camera IP",

    // About Pillars Detail
    pillar1Badge: "Computer Vision",
    pillar1Title: "Xử lý ảnh & Định vị tôm",
    pillar1Desc: "Tự động phát hiện đối tượng tôm từ ảnh chụp điện thoại, máy tính hoặc camera quan trắc ao. Khử nhiễu bề mặt nước, tách nền và bóc tách từng chi tiết hình thái sinh học.",
    pillar1H1: "Lọc bóng phản chiếu mặt nước",
    pillar1H2: "Tách viền cá thể tôm chính xác",
    pillar1H3: "Hỗ trợ đa nguồn camera/ảnh chụp",

    pillar2Badge: "Deep Learning AI",
    pillar2Title: "Nhận dạng & Phân loại đa tiêu chí",
    pillar2Desc: "Áp dụng mô hình học sâu (Deep Neural Networks) để nhận dạng giống tôm (Thẻ chân trắng, tôm Sú, Càng xanh...), phân hạng kích cỡ, phân tích màu sắc và độ bóng khỏe.",
    pillar2H1: "Độ tin cậy nhận diện >96.8%",
    pillar2H2: "Ước lượng size & trọng lượng",
    pillar2H3: "Phân tích sắc diện vỏ tôm",

    pillar3Badge: "Database & History",
    pillar3Title: "Quản lý Lô & Lịch sử nuôi",
    pillar3Desc: "Hệ thống hỗ trợ quản lý dữ liệu theo từng ao nuôi, khu vực nuôi hoặc đợt kiểm tra định kỳ. Lưu trữ toàn bộ lịch sử phân tích phục vụ tra cứu, thống kê và so sánh tăng trưởng.",
    pillar3H1: "Lưu vết lịch sử kiểm định",
    pillar3H2: "Theo dõi biểu đồ tăng trưởng",
    pillar3H3: "Phân nhóm theo ao/khu nuôi",

    pillar4Badge: "Intelligent Trigger",
    pillar4Title: "Cảnh báo bất thường tự động",
    pillar4Desc: "Kịp thời gửi thông báo cảnh báo khi phát hiện tôm có kích thước không đồng đều (phân đàn), màu sắc bất thường (đốm đen, đục cơ) hoặc tỷ lệ loại không đạt vượt ngưỡng.",
    pillar4H1: "Cảnh báo tôm phân đàn mạnh",
    pillar4H2: "Phát hiện đốm đen, đục cơ",
    pillar4H3: "Ngưỡng tỷ lệ loại không đạt",

    // About Criteria Detail
    crit1Name: "Định danh Giống tôm",
    crit1Detail: "Xác định chính xác loại tôm (Tôm thẻ chân trắng Litopenaeus vannamei, Tôm sú Penaeus monodon...) qua cấu trúc gai chủy và vân cơ thể.",
    crit1Status: "Tự động 100%",

    crit2Name: "Phân hạng Kích cỡ",
    crit2Detail: "Đo lường kích thước tương quan, ước lượng chiều dài thân và phân chia size tôm thương phẩm theo tiêu chuẩn thị trường.",
    crit2Status: "Tự động theo điểm ảnh",

    crit3Name: "Màu sắc & Thể trạng",
    crit3Detail: "Kiểm tra màu sắc vỏ tôm, độ trong suốt cơ thịt, phát hiện các hiện tượng sắc tố bất thường như đỏ thân, đốm đen sẹo vỏ.",
    crit3Status: "Phân tích RGB/HSV",

    crit4Name: "Độ đồng đều đàn tôm",
    crit4Detail: "Tính toán hệ số phân tán kích thước (CV%) trong cùng một mẻ chụp mẫu, phát hiện sớm tình trạng phân đàn trong ao nuôi.",
    crit4Status: "Đánh giá mẫu đa điểm",
    crit4Conf: "Độ nhạy cao",

    crit5Name: "Tỷ lệ chuẩn thương phẩm",
    crit5Detail: "Tổng hợp tỷ lệ tôm Loại 1, Loại 2 và loại dạt; tự động kích hoạt cảnh báo nếu tỷ lệ không đạt vượt quá giới hạn thiết lập.",
    crit5Status: "Cảnh báo theo ngưỡng",
    crit5Conf: "Báo cáo tức thì",

    critSampleBadge: "MẪU THỬ NGHIỆM ĐIỂN HÌNH",
    critSampleBtn: "Kiểm tra thử ngay",
    mechanismLabel: "Cơ chế:",

    // About Applications
    app1Title: "Trang trại nuôi tôm thương phẩm",
    app1Desc: "Kiểm tra kích cỡ tôm định kỳ tại bờ ao bằng điện thoại mà không cần bắt cân thủ công gây stress hay tổn thương tôm, theo dõi sinh trưởng liên tục.",
    app1Tag: "Giám sát ao nuôi",

    app2Title: "Cơ sở sản xuất tôm giống",
    app2Desc: "Đánh giá nhanh độ đồng đều của đàn postlarvae, sàng lọc tôm giống đạt chuẩn chất lượng cao trước khi xuất bán cho người nuôi.",
    app2Tag: "Tuyển chọn giống",

    app3Title: "Hợp tác xã thủy sản",
    app3Desc: "Chuẩn hóa dữ liệu chất lượng sản phẩm theo từng lô thu hoạch, minh bạch hóa quy trình nuôi trồng phục vụ truy xuất nguồn gốc.",
    app3Tag: "Chuẩn hóa chuỗi cung ứng",

    app4Title: "Cơ sở thu mua & Chế biến",
    app4Desc: "Phân loại size tôm tốc độ cao khi thu mua tại đầm hoặc trên băng chuyền, loại bỏ yếu tố cảm tính chủ quan, rút ngắn 80% thời gian kiểm định.",
    app4Tag: "Kiểm định & Phân loại nhanh",

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

    // Dashboard Hero & Stats
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

    // Dashboard Features Section
    featuresBadge: "KEY FEATURES",
    featuresTitle: "Intelligent Analysis from Images",
    featuresSubtitle:
      "Applying AI technology to identify, classify, and manage shrimp species information rapidly, accurately, and efficiently.",
    feat1Title: "Shrimp Breed Recognition",
    feat1Desc:
      "Accurately distinguishes common shrimp species: Whiteleg shrimp, Black Tiger shrimp, Giant Freshwater prawn, Spiny Lobster...",
    feat2Title: "AI Classification",
    feat2Desc:
      "Employs Deep Learning models to achieve high precision in species classification.",
    feat3Title: "Inspection History",
    feat3Desc:
      "Stores scan results and imagery for effortless tracking, search, and data management.",

    // Dashboard Live Demo & Steps
    demoBadge: "TRY IT NOW",
    demoTitle: "Inspect Shrimp in Just a Few Steps",
    demoSubtitle:
      "Upload shrimp photos and the AI system automatically identifies the species with real-time confidence scores.",
    demoDrag: "Drag & drop image here",
    demoOr: "or",
    demoChoose: "Browse from device",
    demoFormats: "Supports: JPG, PNG, WEBP | Max size: 10MB",
    analysisInfo: "Inspection Details",
    shrimpSpecies: "Species",
    analysisTime: "Processing Time",
    imageSize: "Image Size",
    demoNote:
      "Results are generated by our AI model and may vary depending on photo quality.",
    stepsBadge: "WORKFLOW",
    stepsTitle: "Just 3 Simple Steps",
    stepsSubtitle:
      "shrimpAI automates the entire process from image upload to vision telemetry and instant species classification.",
    step1Badge: "Data Upload",
    step1Title: "1. Upload Shrimp Photo",
    step1Desc:
      "Upload a clear image of commercial shrimp or snap directly pond-side with your smartphone camera.",
    step1Ready: "Ready",
    step1Action: "Try uploading now",
    step2Badge: "AI Vision",
    step2Title: "2. AI Analysis",
    step2Desc:
      "Multi-layer AI decomposes shell morphology, rostrum spines, and eye stalks for high-precision grading.",
    step2Action: "View AI simulation",
    step3Badge: "✓ 96.8% Confidence",
    step3Title: "3. Instant Results",
    step3Desc:
      "Receive species classification, scientific nomenclature, confidence grading, and auto-save to history.",
    step3Action: "View full report",

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
    cameraPermissionErr:
      "Unable to access camera. Please allow camera permissions in your browser.",

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
    securitySubtitle:
      "Configure Two-Factor Authentication (2FA) and manage devices",
    twoFactorStatus: "Two-Factor Authentication (2FA)",
    activeSessions: "Active Login Sessions",

    // About Us Page
    aboutHeroBadge: "SYSTEM OVERVIEW • shrimpAI VISION PLATFORM",
    aboutHeroTitle:
      "Shrimp Recognition & Classification via Computer Vision and Artificial Intelligence",
    aboutHeroSubtitle:
      "A next-generation computer vision solution empowering shrimp farmers, hatcheries, and aquaculture processors to identify breeds, measure sizes, evaluate uniformity, and detect anomalies rapidly using mobile photos or pond cameras.",
    aboutExploreBtn: "Try Shrimp Analysis",
    aboutBackHome: "Back to Home",
    aboutProjectSignificance: "PROJECT SIGNIFICANCE",
    aboutSignificanceTitle: "Modernizing Aquaculture with Digital Technology",
    aboutSignificanceP1:
      "In traditional shrimp farming, sizing, condition assessment, and sorting are performed manually by eye or sampling. This is labor-intensive, causes stress or injury to the shrimp, and heavily relies on subjective human judgment.",
    aboutSignificanceQuote:
      '"The project builds an AI software platform to recognize and classify shrimp through photos taken by smartphones or cameras. Applying computer vision techniques and deep learning to identify specimens, size distribution, shell coloration, uniformity, and health anomalies."',
    aboutSignificanceAuthor: "— shrimpAI Research & Development",
    aboutSignificanceP2:
      "Analysis telemetry is securely stored in a centralized database and displayed across Web and Mobile applications, allowing pond managers to monitor growth curves and make data-driven harvest decisions.",
    aboutTechPlatform: "TECHNOLOGY PLATFORM",
    aboutPillarsTitle: "4 Core Technology Pillars",
    aboutPillarsSubtitle:
      "Combining computer vision algorithms and deep neural networks to standardize shrimp inspection workflows.",
    aboutCriteriaBadge: "PRACTICAL EVALUATION METRICS",
    aboutCriteriaTitle: "Shrimp Identification & Grading Criteria",
    aboutCriteriaTag: "Calibrated to Industry Standards",
    aboutAppsBadge: "DEPLOYMENT ECOSYSTEM",
    aboutAppsTitle: "Applications & Target User Personas",
    aboutAppsSubtitle:
      "The ecosystem includes a central web portal, mobile field app, and high-speed automated camera stations.",
    aboutCtaBadge: "Ready for Testing",
    aboutCtaTitle: "Start Inspecting Shrimp with shrimpAI",
    aboutCtaSubtitle:
      "Upload a photo or capture live pond-side images to let AI classify breeds, estimate sizes, and deliver comprehensive reports.",
    aboutCtaBtn: "Analyze Shrimp Now",

    // Stats Bar
    statVisionTitle: "AI Vision",
    statVisionDesc: "Modern image processing technology",
    statConfidenceTitle: "96.8%",
    statConfidenceDesc: "High accuracy",
    statAnalysisTitle: "Image Analysis",
    statAnalysisDesc: "Fast and precise",
    statInstantTitle: "Instant Results",
    statInstantDesc: "Saves valuable time",

    // Dashboard Extras
    identifiedStatus: "Identified",
    uploadShrimpSample: "Upload photo",
    dragOrUpload: "Drag & drop or browse device",
    demoSampleTime: "12.4 seconds",
    footerDesc: "Shrimp identification and classification via computer vision and AI",
    footerCopyright: "© 2026 shrimpAI Team. All rights reserved.",

    // About Scanner Card
    scannerCardActive: "Active",
    scannerTarget: "Target",
    modelLabel: "AI Model:",
    modelVal: "YOLOv8 + ResNet Classifier",
    speedLabel: "Processing Speed:",
    speedVal: "0.24s / sample",
    deviceLabel: "Supported Devices:",
    deviceVal: "Smartphone, PC, IP Camera",

    // About Pillars Detail
    pillar1Badge: "Computer Vision",
    pillar1Title: "Vision Processing & Shrimp Localization",
    pillar1Desc: "Automatically detects shrimp specimens from smartphone photos, PCs, or pond cameras. Filters water reflections, segments backgrounds, and isolates bio-morphological contours.",
    pillar1H1: "Water reflection glare filtering",
    pillar1H2: "Precise individual boundary segmentation",
    pillar1H3: "Multi-source camera/photo support",

    pillar2Badge: "Deep Learning AI",
    pillar2Title: "Multi-Criteria AI Classification",
    pillar2Desc: "Employs deep neural networks to classify shrimp breeds (Whiteleg, Black Tiger, Giant Freshwater prawn...), grade size distributions, and evaluate carapace color and luster.",
    pillar2H1: "Identification confidence >96.8%",
    pillar2H2: "Size & weight estimation",
    pillar2H3: "Shell coloration & texture analysis",

    pillar3Badge: "Database & History",
    pillar3Title: "Batch & History Management",
    pillar3Desc: "Supports data tracking per pond, farming zone, or routine cycle. Stores end-to-end inspection records for lookup, statistical growth curves, and historical comparisons.",
    pillar3H1: "Audit-grade inspection traceability",
    pillar3H2: "Growth curve telemetry tracking",
    pillar3H3: "Grouping by pond/farming zone",

    pillar4Badge: "Intelligent Trigger",
    pillar4Title: "Automated Anomaly Alerting",
    pillar4Desc: "Promptly sends alerts when detecting uneven sizing (severe grading dispersion), abnormal discoloration (black spots, opaque muscle), or defective cull ratios exceeding thresholds.",
    pillar4H1: "Severe size disparity alerts",
    pillar4H2: "Detects black spots & opaque muscle",
    pillar4H3: "Defective batch threshold monitoring",

    // About Criteria Detail
    crit1Name: "Species Identification",
    crit1Detail: "Accurately identifies shrimp species (Whiteleg Litopenaeus vannamei, Black Tiger Penaeus monodon...) via rostrum spine architecture and abdominal banding.",
    crit1Status: "100% Automated",

    crit2Name: "Size Grading",
    crit2Detail: "Measures morphological ratios, estimates total body length, and categorizes commercial shrimp sizes adhering to market trade standards.",
    crit2Status: "Pixel-calibrated automated",

    crit3Name: "Color & Vitality",
    crit3Detail: "Evaluates shell color patterns, abdominal translucency, and screens for pigmentation abnormalities like red disease or melanosis scars.",
    crit3Status: "RGB/HSV Spectral Analysis",

    crit4Name: "Batch Uniformity",
    crit4Detail: "Calculates size dispersion coefficient (CV%) within a sampled batch, giving early warning of growth disparities in the pond.",
    crit4Status: "Multi-point sample evaluation",
    crit4Conf: "High Sensitivity",

    crit5Name: "Commercial Grade Ratio",
    crit5Detail: "Summarizes ratios of Grade 1, Grade 2, and culls; automatically triggers alerts if substandard counts exceed safety thresholds.",
    crit5Status: "Threshold-based alerting",
    crit5Conf: "Instant Report",

    critSampleBadge: "TYPICAL TEST SAMPLE",
    critSampleBtn: "Try Test Scan Now",
    mechanismLabel: "Mechanism:",

    // About Applications
    app1Title: "Commercial Shrimp Farms",
    app1Desc: "Routine pond-side sizing using smartphones without manual weighing that causes stress or damage, enabling continuous growth monitoring.",
    app1Tag: "Pond Monitoring",

    app2Title: "Hatcheries & Breeding Centers",
    app2Desc: "Rapidly evaluates postlarvae batch uniformity and screens high-standard seedstock before dispatching to farmers.",
    app2Tag: "Seedstock Screening",

    app3Title: "Aquaculture Cooperatives",
    app3Desc: "Standardizes quality metrics per harvest batch, making farming practices transparent for digital provenance traceability.",
    app3Tag: "Supply Chain Standardization",

    app4Title: "Processors & Purchasing Hubs",
    app4Desc: "High-speed size grading at pond purchasing or conveyor intake, eliminating subjective guesswork and cutting inspection time by 80%.",
    app4Tag: "Rapid Sizing & Grading",

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

const getStoredLang = (): Language => {
  if (typeof window === "undefined") return "vi";
  const saved = localStorage.getItem("app.lang") as Language | null;
  return saved === "vi" || saved === "en" ? saved : "vi";
};

const initialLang = getStoredLang();
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("lang", initialLang);
}

export const useI18nStore = create<I18nState>((set, get) => ({
  lang: initialLang,

  setLang: (lang: Language) => {
    localStorage.setItem("app.lang", lang);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
    set({ lang });
  },

  toggleLang: () => {
    const next = get().lang === "vi" ? "en" : "vi";
    get().setLang(next);
  },

  initLang: () => {
    const current = getStoredLang();
    get().setLang(current);
  },

  t: (key: TranslationKey, fallback?: string) => {
    const current = get().lang;
    return translations[current]?.[key] ?? fallback ?? (key as string);
  },
}));
