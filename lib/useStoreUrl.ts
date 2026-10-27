"use client";

import { useEffect, useState } from "react";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";

// ボタンが1つしか置けない場所（ヘッダー・料金カード・固定バー）用。
// Android 端末なら Google Play、それ以外は App Store を返す。
// SSR とハイドレーション直後は App Store のまま、マウント後に UA で切り替える。
export function useStoreUrl(): string {
  const [url, setUrl] = useState(APP_STORE_URL);

  useEffect(() => {
    if (/android/i.test(navigator.userAgent)) {
      setUrl(GOOGLE_PLAY_URL);
    }
  }, []);

  return url;
}
