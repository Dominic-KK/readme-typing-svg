// Lightweight client-side i18n for the Readme Typing SVG demo
(() => {
  const LANG_KEY = "i18n-lang";
  const DEFAULT_LANG = "en";
  const messages = window.I18n || {};

  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  if (!messages[currentLang]) currentLang = DEFAULT_LANG;

  const i18n = {
    /** Get a translated string. Supports {placeholder} substitution. */
    t(key, params = {}) {
      const dict = messages[currentLang] || messages[DEFAULT_LANG] || {};
      let str = dict[key];
      if (str === undefined) str = messages[DEFAULT_LANG]?.[key] ?? key;
      return String(str).replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "");
    },
    /** Get the current language code */
    lang() {
      return currentLang;
    },
    /** Switch language, persist it, then re-render the document */
    setLang(code, reApply = true) {
      if (!messages[code]) code = DEFAULT_LANG;
      currentLang = code;
      localStorage.setItem(LANG_KEY, code);
      if (reApply) i18n.apply();
      // notify subscribers (e.g. dynamic line labels) after re-render
      this._onChange && this._onChange(currentLang);
      return currentLang;
    },
    /** Apply translations to every marked element in the document */
    apply() {
      document.documentElement.lang = currentLang;
      document.title = i18n.t("demo.title");
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const attr = el.dataset.i18n;
        const text = i18n.t(attr);
        if (attr === "color" || attr === "background") return; // input value, handled by JS
        el.textContent = text;
      });
      document.querySelectorAll("[data-i18n-value]").forEach((el) => {
        el.value = i18n.t(el.dataset.i18nValue);
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        el.placeholder = i18n.t(el.dataset.i18nPlaceholder);
      });
      document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        el.title = i18n.t(el.dataset.i18nTitle);
      });
      // update the language selector to reflect the current language
      const selector = document.getElementById("lang-select");
      if (selector) selector.value = currentLang;
    },
    /** Notify registered callbacks (used for dynamically created content) */
    onChange(cb) {
      this._onChange = cb;
    },
    _onChange: null,
  };

  // expose globally
  window.i18n = i18n;

  // apply the persisted language once the document is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => i18n.apply());
  } else {
    i18n.apply();
  }
})();