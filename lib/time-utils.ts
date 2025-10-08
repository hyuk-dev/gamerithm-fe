import { TFunction } from "react-i18next";

export interface LastPlayedData {
  type: string;
  count: number;
}

export function translateLastPlayed(
  lastPlayed: LastPlayedData | string,
  t: TFunction
): string {
  // Handle legacy string format
  if (typeof lastPlayed === "string") {
    return lastPlayed;
  }

  const { type, count } = lastPlayed;

  switch (type) {
    case "days":
      return t("time.daysAgo", { count });
    case "hours":
      return t("time.hoursAgo", { count });
    case "minutes":
      return t("time.minutesAgo", { count });
    case "justNow":
      return t("time.justNow");
    case "noPlayRecord":
      return t("time.noPlayRecord");
    default:
      return lastPlayed as unknown as string;
  }
}
