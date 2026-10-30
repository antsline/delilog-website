"use client";

import { useEffect, useState } from "react";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";
import { appStoreCampaignUrl, googlePlayCampaignUrl } from "@/lib/storeCampaign";

// ボタンが1つしか置けない場所（ヘッダー・料金カード・固定バー）用。
// Android 端末なら Google Play、それ以外は App Store を返す。
// SSR とハイドレーション直後は App Store のまま、マウント後に UA で切り替える。
// campaign を渡すと、どの入口から来たかの印（ASC の ct / Play の utm_source・utm_medium）を付ける。
export function useStoreUrl(campaign?: string, medium = "blog"): string {
  const appStoreUrl = campaign ? appStoreCampaignUrl(campaign) : APP_STORE_URL;
  const googlePlayUrl = campaign ? googlePlayCampaignUrl(campaign, medium) : GOOGLE_PLAY_URL;
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  return isAndroid ? googlePlayUrl : appStoreUrl;
}
