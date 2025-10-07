import { SITE_URL } from "./steam";

// 서버 측에서만 접근 가능한 환경변수
export const STEAM_API_KEY = process.env.STEAM_API_KEY;
export const STEAM_REDIRECT_URI = `${SITE_URL}/api/steam/callback`;
