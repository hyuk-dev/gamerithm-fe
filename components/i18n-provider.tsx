"use client";

import { useEffect } from "react";
import i18n from "../lib/i18n-client";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure language is properly initialized
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return <>{children}</>;
}
