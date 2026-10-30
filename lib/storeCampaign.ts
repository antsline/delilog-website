import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";

// App Store Connect のプロバイダID（キャンペーンリンクの pt）。
export const APP_STORE_PROVIDER_ID = "127806295";

// App Store Connect のキャンペーン名（ct）の上限文字数。
const MAX_CAMPAIGN_LENGTH = 40;

const UTM_SOURCE_PATTERN = /^[a-z0-9_-]{1,32}$/;

// どの入口から来たかの名前。ASC の ct と Google Play の utm_source に同じ値を使う。
export function blogCampaign(slug?: string): string {
  return slug ? `blog_${slug}` : "blog";
}

// usePathname() の値から、ブログのどのページかを名前にする。記事以外（一覧など）は "blog"。
export function campaignFromBlogPath(pathname: string | null): string {
  const match = pathname?.match(/^\/blog\/([^/]+)\/?$/);
  return blogCampaign(match?.[1]);
}

// トップページに来た人の utm_source（例: アプリの紹介なら app_share）を入口の名前にする。無ければ "lp"。
export function landingCampaign(search: string): string {
  const source = new URLSearchParams(search).get("utm_source");
  return source && UTM_SOURCE_PATTERN.test(source) ? `lp_${source}` : "lp";
}

export function appStoreCampaignUrl(campaign: string): string {
  const params = new URLSearchParams({
    pt: APP_STORE_PROVIDER_ID,
    ct: campaign.slice(0, MAX_CAMPAIGN_LENGTH),
    mt: "8",
  });
  return `${APP_STORE_URL}?${params.toString()}`;
}

export function googlePlayCampaignUrl(source: string, medium: string): string {
  const referrer = encodeURIComponent(`utm_source=${source}&utm_medium=${medium}`);
  return `${GOOGLE_PLAY_URL}&referrer=${referrer}`;
}

// 記事本文（Markdown から作った HTML）の中のストアリンクに、入口の名前を付ける。
export function tagStoreLinks(html: string, campaign: string): string {
  return html
    .replaceAll(`href="${APP_STORE_URL}"`, `href="${escapeAttribute(appStoreCampaignUrl(campaign))}"`)
    .replaceAll(
      `href="${GOOGLE_PLAY_URL}"`,
      `href="${escapeAttribute(googlePlayCampaignUrl(campaign, "blog"))}"`,
    );
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;");
}
