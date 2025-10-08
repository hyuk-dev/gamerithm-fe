import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "../locales/en.json";
import koTranslations from "../locales/ko.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  ko: {
    translation: koTranslations,
  },
};

// Server-side safe initialization
i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en", // Default to English on server
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
