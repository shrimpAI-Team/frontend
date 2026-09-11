const KEY = "app.device.id";
const NAME_KEY = "app.device.name";

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      // Trên Safari iOS qua HTTP (non-secure context), crypto.randomUUID sẽ bị undefined
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        id = crypto.randomUUID().replace(/-/g, "");
      } else {
        id = "dev_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      }
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "safari_dev_" + Math.random().toString(36).substring(2, 12);
  }
}

export function getDeviceName(): string {
  try {
    let name = localStorage.getItem(NAME_KEY);
    if (!name) {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const os = /Windows/.test(ua)
        ? "Windows"
        : /Android/.test(ua)
          ? "Android"
          : /iPhone|iPad/.test(ua)
            ? "iOS"
            : /Mac OS X/.test(ua)
              ? "macOS"
              : /Linux/.test(ua)
                ? "Linux"
                : "Device";
      const br = /Edg\//.test(ua)
        ? "Edge"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Browser";
      // Dùng tiếng Anh ASCII chuẩn để không bao giờ bị lỗi Header Encoding trên Safari WebKit
      name = `${br} on ${os}`;
      localStorage.setItem(NAME_KEY, name);
    }
    return name;
  } catch {
    return "Safari on iOS";
  }
}
