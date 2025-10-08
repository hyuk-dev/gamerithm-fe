"use client";

import { useEffect } from "react";
import "../lib/i18n-client";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is already initialized in i18n-client.ts
  }, []);

  return <>{children}</>;
}
