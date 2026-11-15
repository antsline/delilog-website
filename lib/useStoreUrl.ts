"use client";

import { useEffect, useState } from "react";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";
import { storeUrls, type StoreCampaign } from "@/lib/storeCampaign";

// ボタンが1つしか置けない場所（ヘッダー・料金カード・固定バー）用。
// Android 端末なら Google Play、それ以外は App Store を返す。
// SSR とハイドレーション直後は App Store のまま、マウント後に UA で切り替える。
// campaign を渡すと、どの入口から来たかの印（ASC の ct / Play の utm_*）を付ける。
// 文字列なら ct と utm_source に同じ値を使う（トップページ用）。
export function useStoreUrl(campaign?: string | StoreCampaign, medium = "blog"): string {
  const urls = campaign ? storeUrls(toCampaign(campaign, medium)) : undefined;
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  if (isAndroid) {
    return urls?.googlePlay ?? GOOGLE_PLAY_URL;
  }
  return urls?.appStore ?? APP_STORE_URL;
}

function toCampaign(campaign: string | StoreCampaign, medium: string): StoreCampaign {
  return typeof campaign === "string" ? { ct: campaign, source: campaign, medium } : campaign;
}
