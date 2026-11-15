export type Placement =
  | "dlbox"
  | "top"
  | "inline1"
  | "inline2"
  | "inline3"
  | "end"
  | "footer"
  | "header"
  | "sticky"
  | "body"
  | "list";
export declare const MAX_CAMPAIGN_LENGTH: number;
export declare const APP_STORE_PROVIDER_ID: string;
export declare const MAX_SHORT_ID_LENGTH: number;
export declare const SHORT_ID_PATTERN: RegExp;
export declare const INDEX_ID: string;
export declare const TABLE_SENTINEL_KEY: string;
export declare const PLACEMENTS: readonly Placement[];
export declare function inlinePlacement(n: number): Placement;
export declare function appStoreCampaignHref(baseUrl: string, ct: string): string;
export declare function googlePlayCampaignHref(baseUrl: string, source: string, medium: string, content?: string): string;
export declare function shortIdFor(slug: string | undefined, table: Record<string, string>): string;
export declare function blogSource(shortId: string): string;
export declare function blogCt(shortId: string, placement: string): string;
export declare function blogQrSource(shortId: string): string;
export declare function blogStoreCampaign(
  slug: string | undefined,
  placement: Placement,
  table: Record<string, string>,
): { ct: string; source: string; medium: string; content: Placement };
export declare function shortIdProblems(table: Record<string, string>, slugs: string[]): string[];
export declare function qrStoreCampaign(source: string): { ct: string; source: string; medium: string };
export declare function blogQrUrl(siteUrl: string, shortId: string): string;
export declare function blogQrImagePath(shortId: string): string;
export declare function shortIdFromQrFile(file: string): string | null;
