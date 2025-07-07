// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/image",
    "@nuxtjs/i18n",
  ],

  colorMode: {
    preference: "system", // Default to system preference
    fallback: "light", // Fallback mode if no preference is set
    storageKey: "nuxt-color-mode", // Key used in localStorage
  },

  alias: {
    components: "/components",
    pages: "/pages",
    utils: "/utils",
    assets: "/assets",
  },

  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        iso: "en-US", // ISO code for English
        file: "en-US.json", // Translation file for English
      },
      {
        code: "am",
        name: "Amharic",
        iso: "am-ET", // ISO code for Amharic
        file: "am-ET.json", // Translation file for Amharic
      },
    ],
    defaultLocale: "en", // Set English as the default language
    lazy: true, // Enable lazy loading of translation files
    langDir: "lan", // Directory where translation files are stored
    strategy: "prefix_except_default", // URL strategy
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // Redirect to the detected language on the root path
    },
  },

  compatibilityDate: "2025-03-15",
});
