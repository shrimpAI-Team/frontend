const KEY = "app.device.id";
const NAME_KEY = "app.device.name";

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function getDeviceName(): string {
  let name = localStorage.getItem(NAME_KEY);
  if (!name) {
    const ua = navigator.userAgent;
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
              : "Unknown";
    const br = /Edg\//.test(ua)
      ? "Edge"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
    name = `${br} trên ${os}`;
    localStorage.setItem(NAME_KEY, name);
  }
  return name;
}
