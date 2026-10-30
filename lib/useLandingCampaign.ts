"use client";

import { useEffect, useState } from "react";
import { landingCampaign } from "@/lib/storeCampaign";

// トップページの入口の名前。SSR とハイドレーション直後は "lp"、マウント後に URL の utm_source を読む。
export function useLandingCampaign(): string {
  const [campaign, setCampaign] = useState("lp");

  useEffect(() => {
    setCampaign(landingCampaign(window.location.search));
  }, []);

  return campaign;
}
