// 클라이언트와 서버 양쪽에서 접근 가능한 환경변수 (NEXT_PUBLIC_ 접두사)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// Steam OpenID Provider endpoint
export const STEAM_OPENID_PROVIDER = "https://steamcommunity.com/openid/login";

// OpenID 2.0 constants required by Steam
export const OPENID_NS = "http://specs.openid.net/auth/2.0";
export const OPENID_IDENTIFIER_SELECT =
  "http://specs.openid.net/auth/2.0/identifier_select";

export function getSiteOrigin(fallback: string = "http://localhost:3000") {
  return SITE_URL?.replace(/\/$/, "") || fallback;
}
