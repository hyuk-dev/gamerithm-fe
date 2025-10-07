// 장르 한글-영어 매핑
export const GENRE_MAPPING: Record<string, string> = {
  // 액션
  액션: "Action",
  "액션 게임": "Action",
  "액션 RPG": "Action RPG",

  // RPG
  롤플레잉: "RPG",
  RPG: "RPG",
  "롤플레잉 게임": "RPG",
  "액션 RPG": "Action RPG",
  JRPG: "JRPG",
  "일본 RPG": "JRPG",

  // 전략
  전략: "Strategy",
  "전략 게임": "Strategy",
  "실시간 전략": "Real-Time Strategy",
  "턴제 전략": "Turn-Based Strategy",
  RTS: "Real-Time Strategy",
  TBS: "Turn-Based Strategy",

  // 시뮬레이션
  시뮬레이션: "Simulation",
  "시뮬레이션 게임": "Simulation",
  "경영 시뮬레이션": "Management Simulation",
  "생활 시뮬레이션": "Life Simulation",
  "도시 건설": "City Builder",

  // FPS/TPS
  FPS: "FPS",
  "1인칭 슈터": "FPS",
  "1인칭 슈팅": "FPS",
  TPS: "TPS",
  "3인칭 슈터": "TPS",
  "3인칭 슈팅": "TPS",
  슈터: "Shooter",
  슈팅: "Shooter",

  // 멀티플레이어
  멀티플레이어: "Multiplayer",
  "온라인 멀티플레이어": "Online Multiplayer",
  "로컬 멀티플레이어": "Local Multiplayer",
  협동: "Co-op",
  협력: "Co-op",
  "협동 플레이": "Co-op",

  // 퍼즐/어드벤처
  퍼즐: "Puzzle",
  "퍼즐 게임": "Puzzle",
  어드벤처: "Adventure",
  "어드벤처 게임": "Adventure",
  탐험: "Adventure",

  // 레이싱/스포츠
  레이싱: "Racing",
  "레이싱 게임": "Racing",
  스포츠: "Sports",
  "스포츠 게임": "Sports",

  // 호러
  호러: "Horror",
  "호러 게임": "Horror",
  공포: "Horror",
  "서바이벌 호러": "Survival Horror",

  // 인디/기타
  인디: "Indie",
  "인디 게임": "Indie",
  캐주얼: "Casual",
  "캐주얼 게임": "Casual",
  아케이드: "Arcade",
  레트로: "Retro",
  클래식: "Classic",

  // 기타
  플랫포머: "Platformer",
  플랫폼: "Platformer",
  스텔스: "Stealth",
  잠입: "Stealth",
  파이팅: "Fighting",
  격투: "Fighting",
  무협: "Fighting",
  대전: "Fighting",
  로그라이크: "Roguelike",
  로그라이트: "Roguelite",
  메트로배니아: "Metroidvania",
  소울즈라이크: "Souls-like",
  "배틀 로얄": "Battle Royale",
  MOBA: "MOBA",
  MMO: "MMO",
  "대규모 멀티플레이어": "MMO",
  "카드 게임": "Card Game",
  "보드 게임": "Board Game",
  "파티 게임": "Party Game",
  VR: "VR",
  가상현실: "VR",

  // Unknown 처리
  Unknown: "Unknown",
  "알 수 없음": "Unknown",
  기타: "Other",

  // 추가 Steam 장르들 (실제 Steam API에서 오는 장르들)
  "Single-player": "Single-player",
  "싱글 플레이어": "Single-player",
  싱글플레이어: "Single-player",

  "Multi-player": "Multiplayer",
  "멀티 플레이어": "Multiplayer",
  멀티플레이어: "Multiplayer",

  "Co-op": "Co-op",
  협동: "Co-op",
  협력: "Co-op",

  "Massively Multiplayer": "MMO",
  "대규모 멀티플레이어": "MMO",
  MMO: "MMO",

  "Early Access": "Early Access",
  "얼리 액세스": "Early Access",

  "Free to Play": "Free to Play",
  무료: "Free to Play",
  "무료 게임": "Free to Play",

  "VR Support": "VR",
  "VR 지원": "VR",
  VR: "VR",

  "Controller Support": "Controller Support",
  "컨트롤러 지원": "Controller Support",

  "Mod Support": "Mod Support",
  "모드 지원": "Mod Support",

  "Steam Workshop": "Steam Workshop",
  "스팀 워크샵": "Steam Workshop",

  "Steam Cloud": "Steam Cloud",
  "스팀 클라우드": "Steam Cloud",

  "Steam Achievements": "Steam Achievements",
  "스팀 도전과제": "Steam Achievements",

  "Steam Trading Cards": "Steam Trading Cards",
  "스팀 거래 카드": "Steam Trading Cards",

  "Steam Leaderboards": "Steam Leaderboards",
  "스팀 리더보드": "Steam Leaderboards",

  "Steam Input": "Steam Input",
  "스팀 입력": "Steam Input",

  "Full controller support": "Full Controller Support",
  "완전한 컨트롤러 지원": "Full Controller Support",

  "Partial Controller Support": "Partial Controller Support",
  "부분적 컨트롤러 지원": "Partial Controller Support",

  "Remote Play Together": "Remote Play Together",
  "원격 함께 플레이": "Remote Play Together",

  "Steam Deck Verified": "Steam Deck Verified",
  "스팀 덱 검증됨": "Steam Deck Verified",

  "Steam Deck Playable": "Steam Deck Playable",
  "스팀 덱 플레이 가능": "Steam Deck Playable",

  "Steam Deck Unsupported": "Steam Deck Unsupported",
  "스팀 덱 미지원": "Steam Deck Unsupported",

  "Cross-Platform Multiplayer": "Cross-Platform Multiplayer",
  "크로스 플랫폼 멀티플레이어": "Cross-Platform Multiplayer",

  "Local Co-op": "Local Co-op",
  "로컬 협동": "Local Co-op",

  "Online Co-op": "Online Co-op",
  "온라인 협동": "Online Co-op",

  "Turn-Based": "Turn-Based",
  턴제: "Turn-Based",
  "턴 기반": "Turn-Based",

  "Real-Time": "Real-Time",
  실시간: "Real-Time",
  "실시간 전략": "Real-Time Strategy",

  Tactical: "Tactical",
  전술: "Tactical",
  전술적: "Tactical",

  Sandbox: "Sandbox",
  샌드박스: "Sandbox",

  "Open World": "Open World",
  "오픈 월드": "Open World",
  "자유 세계": "Open World",

  "Story Rich": "Story Rich",
  "풍부한 스토리": "Story Rich",
  "스토리 풍부": "Story Rich",

  Atmospheric: "Atmospheric",
  분위기: "Atmospheric",
  "분위기 있는": "Atmospheric",

  "Great Soundtrack": "Great Soundtrack",
  "훌륭한 사운드트랙": "Great Soundtrack",
  "좋은 음악": "Great Soundtrack",

  "Visual Novel": "Visual Novel",
  "비주얼 노벨": "Visual Novel",

  Anime: "Anime",
  애니메이션: "Anime",
  애니메: "Anime",

  Mature: "Mature",
  성인: "Mature",
  성인용: "Mature",

  Violent: "Violent",
  폭력적: "Violent",
  폭력: "Violent",

  Gore: "Gore",
  고어: "Gore",
  잔혹함: "Gore",

  "Sexual Content": "Sexual Content",
  "성적 콘텐츠": "Sexual Content",

  Nudity: "Nudity",
  나체: "Nudity",
  누드: "Nudity",

  "Strong Language": "Strong Language",
  "강한 언어": "Strong Language",
  욕설: "Strong Language",

  "Drug Reference": "Drug Reference",
  "마약 언급": "Drug Reference",

  "Alcohol Reference": "Alcohol Reference",
  "알코올 언급": "Alcohol Reference",
};

// 영어 장르를 한글로 변환하는 역매핑
export const GENRE_REVERSE_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(GENRE_MAPPING).map(([korean, english]) => [english, korean])
);

// 필터링용 기본 장르 목록 (영어 기준) - 주요 장르들만 필터링에 표시
export const FILTER_GENRES = [
  "Action",
  "RPG",
  "Strategy",
  "Simulation",
  "FPS",
  "TPS",
  "Multiplayer",
  "Adventure",
  "Puzzle",
  "Racing",
  "Sports",
  "Horror",
  "Indie",
  "Casual",
  "Platformer",
  "Stealth",
  "Fighting",
  "Roguelike",
  "Battle Royale",
  "Card Game",
  "VR",
  "Other",
  "Unknown",
];

// 모든 지원되는 장르 목록 (정규화용)
export const ALL_SUPPORTED_GENRES = [
  "Action",
  "RPG",
  "Strategy",
  "Simulation",
  "FPS",
  "TPS",
  "Multiplayer",
  "Adventure",
  "Puzzle",
  "Racing",
  "Sports",
  "Horror",
  "Indie",
  "Casual",
  "Platformer",
  "Stealth",
  "Fighting",
  "Roguelike",
  "Battle Royale",
  "Card Game",
  "VR",
  "Other",
  "Unknown",
  // 추가 장르들
  "Action RPG",
  "Real-Time Strategy",
  "Turn-Based Strategy",
  "Management Simulation",
  "Life Simulation",
  "City Builder",
  "Shooter",
  "Online Multiplayer",
  "Local Multiplayer",
  "Co-op",
  "Survival Horror",
  "Arcade",
  "Retro",
  "Classic",
  "Roguelite",
  "Metroidvania",
  "Souls-like",
  "MOBA",
  "MMO",
  "Board Game",
  "Party Game",
  "Single-player",
  "Early Access",
  "Free to Play",
  "VR Support",
  "Controller Support",
  "Mod Support",
  "Steam Workshop",
  "Steam Cloud",
  "Steam Achievements",
  "Steam Trading Cards",
  "Steam Leaderboards",
  "Steam Input",
  "Full Controller Support",
  "Partial Controller Support",
  "Remote Play Together",
  "Steam Deck Verified",
  "Steam Deck Playable",
  "Steam Deck Unsupported",
  "Cross-Platform Multiplayer",
  "Local Co-op",
  "Online Co-op",
  "Turn-Based",
  "Real-Time",
  "Tactical",
  "Sandbox",
  "Open World",
  "Story Rich",
  "Atmospheric",
  "Great Soundtrack",
  "Visual Novel",
  "Anime",
  "Mature",
  "Violent",
  "Gore",
  "Sexual Content",
  "Nudity",
  "Strong Language",
  "Drug Reference",
  "Alcohol Reference",
];

// 장르를 영어로 정규화하는 함수
export function normalizeGenre(genre: string): string {
  // 이미 지원되는 영어 장르인 경우 그대로 반환
  if (ALL_SUPPORTED_GENRES.includes(genre)) {
    return genre;
  }

  // 한글인 경우 영어로 변환
  const normalized = GENRE_MAPPING[genre];
  if (normalized) {
    return normalized;
  }

  // 매핑되지 않은 경우 Unknown으로 처리
  return "Unknown";
}

// 영어 장르를 한글로 변환하는 함수
export function translateGenre(genre: string): string {
  return GENRE_REVERSE_MAPPING[genre] || genre;
}
