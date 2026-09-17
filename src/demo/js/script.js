const preview = {
  // Readme Typing SVG 参数的默认值
  defaults: {
    font: "monospace",
    weight: "400",
    color: "9A53F7FF",
    background: "101010E6",
    size: "20",
    letterSpacing: "normal",
    center: "false",
    vCenter: "false",
    multiline: "false",
    width: "400",
    height: "50",
    duration: "5000",
    pause: "0",
    repeat: "true",
    random: "false",
    separator: ";",
  },
  // 与默认值不同的输入框初始值
  overrides: {
    font: "Fira Code",
    pause: "1000",
    width: "435",
  },

  /**
   * 获取当前语言的默认字体。
   * 中文使用本地托管的苍耳今楷字体；其他语言使用 Fira Code。
   * @returns {string} 当前语言使用的默认字体族
   */
  getDefaultFont() {
    return window.i18n && window.i18n.lang() === "zh-CN" ? "CangErJinKai" : "Fira Code";
  },
  // 默认行值的备用示例文本
  _fallbackDummyText: [
    "The five boxing wizards jump quickly",
    "How vexingly quick daft zebras jump",
    "Quick fox jumps nightly above wizard",
    "Sphinx of black quartz, judge my vow",
    "Waltz, bad nymph, for quick jigs vex",
    "Glib jocks quiz nymph to vex dwarf",
    "Jived fox nymph grabs quick waltz",
  ],

  /**
   * 获取当前语言的示例文本
   * @returns {array<string>} 当前语言的示例行列表
   */
  getDummyText() {
    const dict = window.I18n && window.I18n[window.i18n.lang()];
    const list = dict && dict["lines.dummy"];
    return Array.isArray(list) && list.length ? list : this._fallbackDummyText;
  },

  /**
   * 从表单中获取当前参数
   * @returns {object} 当前参数
   */
  getParams() {
    // 从 .param 字段中获取所有参数
    const params = Array.from(document.querySelectorAll(".param:not([data-index])")).reduce((acc, next) => {
      // 将累加器复制到局部对象中
      let obj = acc;
      let value = next.value;
      // 去除颜色中的 # 号，若为全不透明则去掉末尾的 "FF"
      value = value.replace(/^#([A-Fa-f0-9]{6})(?:[Ff]{2})?/, "$1");
      // 将值加入规约累加器
      obj[next.id] = value;
      return obj;
    }, {});
    // 将 lines 加入参数中
    const lineInputs = Array.from(document.querySelectorAll(".param[data-index]"));
    /**
     * 用给定的分隔符把行数组合并
     * @param {array<HTMLInputElement>} lines 要合并的行输入框
     * @param {string} separator 插入到各行的分隔符
     * @returns 合并后的行参数字符串
     */
    const mergeLines = function (lines, separator) {
      return lines
        .map((el) => el.value) // 获取值
        .filter((val) => val.length) // 跳过空白条目
        .join(separator); // 用分隔符连接各行的值
    };
    // 若分隔符包含在行内则更改分隔符
    params.separator = ";";
    while (mergeLines(lineInputs, "").indexOf(params.separator) >= 0) {
      // 将最后一个字符改为下一个 ASCII 字符（';' 到 '@'），否则追加一个分号
      if (params.separator.charCodeAt(params.separator.length - 1) < "@".charCodeAt(0)) {
        params.separator =
          params.separator.slice(0, -1) +
          String.fromCharCode(params.separator.charCodeAt(params.separator.length - 1) + 1);
      } else {
        params.separator += ";";
      }
    }
    params.lines = mergeLines(lineInputs, params.separator);
    return params;
  },

  /**
   * 更新预览图片和 markdown
   */
  update() {
    const copyButtons = document.querySelectorAll(".copy-button");
    // 获取参数值
    const params = this.getParams();
    // 将参数转换为查询字符串
    const query = Object.keys(params)
      .filter((key) => params[key] !== this.defaults[key]) // 若是默认值则跳过
      .map((key) => this.customEncode(key) + "=" + this.customEncode(params[key])) // 对键和值进行编码
      .join("&"); // 用 '&' 分隔符连接各行
    // 生成链接和 markdown
    const imageURL = `${window.location.origin}?${query}`;
    const demoImageURL = `/?${query}`;
    const repoLink = "https://github.com/Dominic-KK/readme-typing-svg";
    const md = `[![Typing SVG](${imageURL})](${repoLink})`;
    const html = `<a href="${repoLink}"><img src="${imageURL}" alt="Typing SVG" /></a>`;
    // 若没有变化则不更新
    const mdElement = document.querySelector(".md code");
    const htmlElement = document.querySelector(".html code");
    const image = document.querySelector(".output img");
    if (mdElement.innerText === md) {
      return;
    }
    // 更新图片预览
    image.src = demoImageURL;
    image.classList.add("loading");
    // 更新 markdown 和 html
    mdElement.innerText = md;
    htmlElement.innerText = html;
    // 若没有填写任何行则禁用复制按钮
    copyButtons.forEach((el) => (el.disabled = !params.lines.length));
    // 更新 URL 以匹配参数
    this.openPermalink();
  },

  /**
   * 对用于 URL 的字符串进行编码，但保留分号为 ';'、空格为 '+'
   * @param {string} str 要编码的字符串
   * @returns 编码后的字符串
   */
  customEncode(str) {
    // encodeURIComponent 不会转义 ( 和 )，当它们出现在输入中时会破坏生成的
    // markdown 链接语法 [![...](url)](...)
    return encodeURIComponent(str)
      .replace(/%3B/g, ";")
      .replace(/%20/g, "+")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  },

  /**
   * 添加新的行输入框
   * @param {number} count 要添加的行数
   * @returns {false} 始终返回 false 以防止表单提交
   */
  addLines(count) {
    for (let i = 0; i < count; i++) {
      const parent = document.querySelector(".lines");
      const index = parent.querySelectorAll("input").length + 1;
      // 占位符（已翻译）
      const placeholder = window.i18n ? window.i18n.t("line.placeholder") : "Enter text here";
      // 标签
      const label = document.createElement("label");
      label.innerText = window.i18n ? window.i18n.t("line", { n: index }) : `Line ${index}`;
      label.setAttribute("for", `line-${index}`);
      label.dataset.index = index;
      // 行输入框
      const input = document.createElement("input");
      input.className = "param";
      input.type = "text";
      input.id = `line-${index}`;
      input.name = `line-${index}`;
      input.placeholder = placeholder;
      input.value = this.getDummyText()[(index - 1) % this.getDummyText().length];
      input.dataset.index = index;
      // 删除按钮
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-line btn";
      deleteButton.setAttribute("onclick", "return preview.removeLine(this.dataset.index);");
      deleteButton.innerHTML =
        '<svg stroke="currentColor" fill="currentColor"  stroke-width="0" viewBox="0 0 1024 1024" height="0.85em" width="0.85em" xmlns="http://www.w3.org/2000/svg"> <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"> </path> </svg>';
      deleteButton.dataset.index = index;

      // 添加元素
      parent.appendChild(label);
      parent.appendChild(input);
      parent.appendChild(deleteButton);

      // 若只有 1 条则禁用按钮
      parent.querySelector(".delete-line.btn").disabled = index == 1;
    }

    // 更新并退出
    this.update();
    return false;
  },

  /**
   * 移除一个行输入框
   * @param {number} index 要移除的行的索引
   * @returns {false} 始终返回 false 以防止表单提交
   */
  removeLine(index) {
    index = Number(index);
    const parent = document.querySelector(".lines");
    // 移除指定属性的所有元素
    parent.querySelectorAll(`[data-index="${index}"]`).forEach((el) => {
      parent.removeChild(el);
    });
    // 更新索引编号
    const labels = parent.querySelectorAll("label");
    labels.forEach((label) => {
      const labelIndex = Number(label.dataset.index);
      if (labelIndex > index) {
        label.dataset.index = labelIndex - 1;
        label.setAttribute("for", `line-${labelIndex - 1}`);
        label.innerText = window.i18n ? window.i18n.t("line", { n: labelIndex - 1 }) : `Line ${labelIndex - 1}`;
      }
    });
    const inputs = parent.querySelectorAll(".param");
    inputs.forEach((input) => {
      const inputIndex = Number(input.dataset.index);
      if (inputIndex > index) {
        input.dataset.index = inputIndex - 1;
        input.setAttribute("id", `line-${inputIndex - 1}`);
        input.setAttribute("name", `line-${inputIndex - 1}`);
      }
    });
    const buttons = parent.querySelectorAll(".delete-line.btn");
    buttons.forEach((button) => {
      const buttonIndex = Number(button.dataset.index);
      if (buttonIndex > index) {
        button.dataset.index = buttonIndex - 1;
      }
    });
    // 若只有 1 条则禁用按钮
    buttons[0].disabled = buttons.length == 1;
    // 更新并退出
    this.update();
    return false;
  },

  /**
   * 将所有输入框重置为初始值
   * @returns {false} 始终返回 false 以防止表单提交
   */
  reset() {
    // 重置所有输入
    const inputs = document.querySelectorAll(".param");
    inputs.forEach((input) => {
      let value = this.overrides[input.name] || this.defaults[input.name];
      if (value) {
        if (["color", "background"].includes(input.name)) {
          input.jscolor.fromString(value);
        } else {
          input.value = value;
        }
      }
    });
  },

  /**
   * 以永久链接（permalink）格式获取当前参数
   * @returns {string} 永久链接 URL
   */
  getPermalink() {
    // 从表单中获取参数
    const params = this.getParams();
    // 将参数转换为查询字符串
    const defaultInputs = { ...this.defaults, ...this.overrides };
    defaultInputs.lines = this.getDummyText()[0];
    const query = Object.keys(params)
      .filter((key) => params[key] !== defaultInputs[key]) // 若是默认值则跳过
      .map((key) => this.customEncode(key) + "=" + this.customEncode(params[key])) // 对键和值进行编码
      .join("&"); // 用 '&' 分隔符连接各行
    // 返回永久链接
    return `${window.location.origin}${window.location.pathname}` + (query ? `?${query}` : "");
  },

  /**
   * 将当前参数保存到 URL
   */
  openPermalink() {
    window.history.replaceState({}, "", this.getPermalink());
  },

  /**
   * 从 URL 恢复上次保存的参数
   */
  restore() {
    // 从 URL 中获取参数
    const urlParams = new URLSearchParams(window.location.search);
    const params = { ...this.defaults, ...this.overrides, ...Object.fromEntries(urlParams) };
    // 当 URL 未设置字体时，使用与语言相关的默认字体
    if (!urlParams.has("font")) params.font = this.getDefaultFont();
    // 设置所有参数
    const inputs = document.querySelectorAll(".param");
    inputs.forEach((input) => {
      let value = params[input.name];
      if (value) {
        if (["color", "background"].includes(input.name)) {
          input.jscolor.fromString(value);
        } else {
          input.value = value;
        }
      }
    });
    // 添加行
    const lines = params.lines || this.getDummyText()[0];
    const lineInputs = lines.split(params.separator);
    this.addLines(lineInputs.length);
    lineInputs.forEach((line, index) => {
      document.querySelector(`#line-${index + 1}`).value = line;
    });
  },
};

const clipboard = {
  /**
   * 将文本复制到剪贴板
   * @param {HTMLElement} btn 被点击的元素
   * @param {String} text 要复制的文本
   */
  copy(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
      // 设置提示文本
      btn.title = window.i18n ? window.i18n.t("copied") : "Copied!";
    });
  },

  /**
   * 将代码块中的文本复制到剪贴板
   * @param {HTMLElement} btn 被点击的元素
   */
  copyCode(btn) {
    this.copy(btn, btn.parentElement.querySelector("code").innerText);
  },

  /**
   * 将永久链接复制到剪贴板
   * @param {HTMLElement} btn 被点击的元素
   */
  copyPermalink(btn) {
    this.copy(btn, preview.getPermalink());
  },
};

const tooltip = {
  /**
   * 重置提示文本
   * @param {HTMLElement} el 被点击的元素
   */
  reset(el) {
    // 移除提示文本
    el.removeAttribute("title");
  },
};

// 与页面交互时刷新预览
document.addEventListener("keyup", () => preview.update(), false);
document.addEventListener("click", () => preview.update(), false);

// 当语言变化时，为动态添加的行输入框重新设置标签，
// 并刷新仍显示上一语言示例文本的行
if (window.i18n) {
  window.i18n.onChange(() => {
    // 根据语言切换 FAQ 链接指向的版本文档
    const faqLink = document.getElementById("faq-link");
    if (faqLink) {
      const suffix = window.i18n.lang() === "zh-TW" ? ".zh-TW" : window.i18n.lang() === "en" ? ".en" : "";
      faqLink.href = `https://github.com/Dominic-KK/readme-typing-svg/blob/main/docs/faq${suffix}.md`;
    }
    const dummy = preview.getDummyText();
    // 若字体仍是默认字体，则切换到语言相关的默认字体
    const fontEl = document.getElementById("font");
    if (fontEl && ["Fira Code", "CangErJinKai"].includes(fontEl.value)) {
      fontEl.value = preview.getDefaultFont();
    }
    document.querySelectorAll(".lines label[data-index]").forEach((label) => {
      const n = Number(label.dataset.index);
      label.innerText = window.i18n.t("line", { n });
    });
    document.querySelectorAll(".lines input[data-index]").forEach((input) => {
      const i = Number(input.dataset.index) - 1;
      // 替换仍显示任一语言示例文本的行
      let isSample = preview._fallbackDummyText.includes(input.value);
      if (!isSample && window.I18n) {
        for (const lang in window.I18n) {
          const list = window.I18n[lang]["lines.dummy"];
          if (Array.isArray(list) && list.includes(input.value)) {
            isSample = true;
            break;
          }
        }
      }
      if (isSample) {
        input.value = dummy[i % dummy.length];
      }
    });
    preview.update(); // 语言/字体变化后刷新 SVG 预览
  });
}

// 复选框监听
document.querySelector(".show-border input").addEventListener("change", function () {
  const img = document.querySelector(".output img");
  this.checked ? img.classList.add("outlined") : img.classList.remove("outlined");
});

// 页面加载时
window.addEventListener(
  "load",
  () => {
    preview.restore(); // 恢复参数
    preview.update(); // 更新预览
  },
  false
);
