import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";
import shortIdTable from "@/content/blog-short-ids.json";
import {
  appStoreCampaignHref,
  blogStoreCampaign,
  googlePlayCampaignHref,
  type Placement,
} from "@/lib/storeNaming.mjs";

export type { Placement };

const UTM_SOURCE_PATTERN = /^[a-z0-9_-]{1,32}$/;

const SHORT_IDS: Record<string, string> = shortIdTable;

// ストアのリンクに付ける入口の印。ct は App Store、source / medium / content は Google Play の referrer。
export type StoreCampaign = {
  ct: string;
  source: string;
  medium: string;
  content?: string;
};

// 記事（slug なしなら一覧）の1つの配置の印。命名は lib/storeNaming.mjs、短い ID は content/blog-short-ids.json。
export function blogLinkCampaign(slug: string | undefined, placement: Placement): StoreCampaign {
  return blogStoreCampaign(slug, placement, SHORT_IDS);
}

// usePathname() の値から記事の slug を取り出す。記事以外（一覧など）は undefined。
export function slugFromBlogPath(pathname: string | null): string | undefined {
  return pathname?.match(/^\/blog\/([^/]+)\/?$/)?.[1];
}

// トップページに来た人の utm_source（例: アプリの紹介なら app_share）を入口の名前にする。無ければ "lp"。
export function landingCampaign(search: string): string {
  const source = new URLSearchParams(search).get("utm_source");
  return source && UTM_SOURCE_PATTERN.test(source) ? `lp_${source}` : "lp";
}

export function appStoreCampaignUrl(campaign: string): string {
  return appStoreCampaignHref(APP_STORE_URL, campaign);
}

export function googlePlayCampaignUrl(source: string, medium: string, content?: string): string {
  return googlePlayCampaignHref(GOOGLE_PLAY_URL, source, medium, content);
}

export function storeUrls(campaign: StoreCampaign): { appStore: string; googlePlay: string } {
  return {
    appStore: appStoreCampaignUrl(campaign.ct),
    googlePlay: googlePlayCampaignUrl(campaign.source, campaign.medium, campaign.content),
  };
}

// HTML の中の素のストアリンク（記事の Markdown に書いた URL そのまま）に入口の印を付ける。
// 印の付いたリンクは URL が変わるので、外側から呼び直しても二重には付かない。
export function tagStoreLinks(html: string, campaign: StoreCampaign): string {
  const urls = storeUrls(campaign);
  return html
    .replaceAll(`href="${APP_STORE_URL}"`, `href="${escapeAttribute(urls.appStore)}"`)
    .replaceAll(`href="${GOOGLE_PLAY_URL}"`, `href="${escapeAttribute(urls.googlePlay)}"`);
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;");
}
