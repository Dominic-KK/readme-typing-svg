// 用于 Readme Typing SVG 演示的轻量级客户端国际化（i18n）
(() => {
  const LANG_KEY = "i18n-lang";
  const DEFAULT_LANG = "en";
  const messages = window.I18n || {};

  // 安全的 localStorage 访问（在隐私/受限环境中可能抛出异常）
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        /* 忽略写入失败 */
      }
    },
  };

  /**
   * 检测系统/浏览器语言，并映射为受支持的语言代码。
   * 优先级：zh-TW / zh-HK / zh-Hant -> zh-TW；其他 zh* -> zh-CN；否则为 en。
   */
  function detectSystemLang() {
    const raw = navigator.language || navigator.userLanguage || "";
    const lang = raw.toLowerCase();
    if (/^zh-(tw|hk|mo)/.test(lang) || lang.includes("hant")) return "zh-TW";
    if (lang.startsWith("zh")) return "zh-CN";
    return DEFAULT_LANG;
  }

  // 用户的显式选择优先；否则遵循系统语言。
  let currentLang = store.get(LANG_KEY) || detectSystemLang();
  if (!messages[currentLang]) currentLang = DEFAULT_LANG;

  const i18n = {
    /** 获取翻译后的字符串。支持 {占位符} 替换。 */
    t(key, params = {}) {
      const dict = messages[currentLang] || messages[DEFAULT_LANG] || {};
      let str = dict[key];
      if (str === undefined) str = messages[DEFAULT_LANG]?.[key] ?? key;
      return String(str).replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "");
    },
    /** 获取当前语言代码 */
    lang() {
      return currentLang;
    },
    /** 切换语言、持久化保存，然后重新渲染文档 */
    setLang(code, reApply = true) {
      if (!messages[code]) code = DEFAULT_LANG;
      currentLang = code;
      store.set(LANG_KEY, code);
      if (reApply) i18n.apply();
      // 重新渲染后通知订阅者（例如动态行标签）
      this._onChange && this._onChange(currentLang);
      return currentLang;
    },
    /** 将翻译应用到文档中所有带标记的元素上 */
    apply() {
      document.documentElement.lang = currentLang;
      document.title = i18n.t("demo.title");
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const attr = el.dataset.i18n;
        const text = i18n.t(attr);
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
      // 更新语言选择器以反映当前语言
      const selector = document.getElementById("lang-select");
      if (selector) selector.value = currentLang;
    },
    /** 注册回调（用于动态创建的内容） */
    onChange(cb) {
      this._onChange = cb;
    },
    _onChange: null,
  };

  // 暴露到全局作用域
  window.i18n = i18n;

  // 文档就绪后应用已持久化的语言
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => i18n.apply());
  } else {
    i18n.apply();
  }
})();