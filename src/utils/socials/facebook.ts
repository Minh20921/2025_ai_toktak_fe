// src/utils/socials/facebook.ts

// Chỉ gọi các hàm từ file này ở CLIENT (trong useEffect / client component).
declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: fb.FacebookStatic & { __inited?: boolean };
  }
}

export interface FacebookPage {
  id: string;
  name: string;
  picture: string;
}

let fbInitPromise: Promise<fb.FacebookStatic | undefined> | null = null;

export const loadFacebookSDK = (): Promise<fb.FacebookStatic | undefined> => {
  // SSR guard
  if (typeof window === "undefined") return Promise.resolve(undefined);

  // Nếu đã init hoàn tất trước đó → dùng lại
  if (window.FB && window.FB.__inited) {
    return Promise.resolve(window.FB);
  }

  // Nếu đang có promise đang nạp → dùng lại để tránh nạp trùng
  if (fbInitPromise) return fbInitPromise;

  fbInitPromise = new Promise((resolve) => {
    const initFB = () => {
      try {
        if (!window.FB) {
          // SDK chưa sẵn sàng, đợi onload sẽ gọi lại
          return;
        }
        // KHÔNG auto getLoginStatus
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "",
          cookie: true,
          xfbml: false,     // tránh side-effect; bật true nếu cần plugin XFBML
          version: "v22.0",
          status: false,    // ❗ KHÔNG tự gọi getLoginStatus
        });

        // Monkey-patch getLoginStatus trên HTTP để khỏi log rác khi có chỗ khác lỡ gọi
        patchGetLoginStatusOnHttp();

        window.FB.__inited = true;
        resolve(window.FB);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[FB SDK] init failed:", e);
        }
        resolve(undefined);
      }
    };

    // Nếu đã có script (và có thể đã load xong)
    if (document.getElementById("facebook-jssdk")) {
      // Nếu SDK đã sẵn rồi
      if (window.FB) {
        initFB();
      } else {
        // Chờ fbAsyncInit (SDK sẽ gọi)
        window.fbAsyncInit = () => initFB();
      }
      return;
    }

    // Thiết lập fbAsyncInit (SDK gọi khi sẵn sàng)
    window.fbAsyncInit = () => initFB();

    // Chèn script 1 lần
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.onerror = () => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[FB SDK] failed to load sdk.js");
      }
      resolve(undefined);
    };
    document.body.appendChild(script);
  });

  return fbInitPromise;
};

/**
 * Trên HTTP (không phải https:), Facebook chặn getLoginStatus → patch để tránh log rác.
 * Trên HTTPS: KHÔNG patch, để SDK hoạt động bình thường.
 */
function patchGetLoginStatusOnHttp() {
  try {
    if (typeof window === "undefined" || !window.FB) return;
    const isHttps = location.protocol === "https:";
    if (isHttps) return;

    if (typeof window.FB.getLoginStatus === "function") {
      const patched = (cb?: (res: fb.StatusResponse) => void) => {
        cb?.({ status: "unknown" } as fb.StatusResponse);
        if (process.env.NODE_ENV !== "production") {
          console.warn("[FB SDK] getLoginStatus is disabled on HTTP (patched).");
        }
      };
      // @ts-ignore: override intentionally
      window.FB.getLoginStatus = patched;
    }
  } catch {
    // ignore
  }
}
