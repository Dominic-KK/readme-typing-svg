# 常見問題（FAQ）

## 如何在我的 Readme 中包含 Readme Typing SVG？

GitHub 上的 Markdown 檔案支援使用 Markdown 或 HTML 嵌入圖片。你可以在[示範網站](https://readme-typing-svg.demolab.com/demo/)上自訂你的 SVG，並透過以下任一方式使用圖片來源：

### Markdown

```md
[![Typing SVG](https://readme-typing-svg.demolab.com/?lines=First+line+of+text;Second+line+of+text)](https://github.com/Dominic-KK/readme-typing-svg)
```

### HTML

<!-- prettier-ignore-start -->
```html
<a href="https://github.com/Dominic-KK/readme-typing-svg"><img src="https://readme-typing-svg.demolab.com/?lines=First+line+of+text;Second+line+of+text"/></a>
```
<!-- prettier-ignore-end -->

## 文字在末尾被截掉了，要怎麼修復？

SVG 內渲染的文字寬度是可變的，因此你必須手動指定寬度，以確保文字能夠完整顯示。

應該增大 URL 中的 `width` 參數，使文字能以完整寬度正確顯示。

```md
https://readme-typing-svg.demolab.com/?lines=Your+Long+Message+With+A+Long+Width&width=460
```

## 如何在頁面上置中顯示圖片？

要將圖片置中對齊，你需要使用 HTML 語法，並將其包覆在帶有 HTML 屬性 `align="center"` 的元素中。

<!-- prettier-ignore-start -->
```html
<p align="center">
  <a href="https://github.com/Dominic-KK/readme-typing-svg"><img src="https://readme-typing-svg.demolab.com/?lines=This+image+is+center-aligned&font=Fira%20Code&center=true&width=380&height=50"/></a>
</p>
```
<!-- prettier-ignore-end -->

## 如何在一行的中間加入多個空格？

與 HTML 類似，SVG/XML 會將多個連續空格視為單一空格。

一種加入額外空格的變通方法是使用其他空白字元（例如，你可以從 https://qwerty.dev/whitespace 複製貼上半形空格（en-space）或其他不常見的空格）。這些替代的空白字元不會被忽略。

## 如何為深色模式和淺色模式製作不同的 SVG？

自 2022 年 5 月起，你可以使用 `<picture>` 和 `<source>` 元素來[指定主題上下文](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/)，如下所示。深色模式版本出現在 `<source>` 標籤的 `srcset` 中，淺色模式版本出現在 `<img>` 標籤的 `src` 中。

<!-- prettier-ignore-start -->
```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://readme-typing-svg.demolab.com/?lines=You+are+using+dark+mode&color=FFFFFF" />
  <img src="https://readme-typing-svg.demolab.com/?lines=You+are+using+light+mode&color=000000" />
</picture>
```
<!-- prettier-ignore-end -->

## 如何為我的個人主頁建立 Readme？

當你建立一個與你的使用者名稱同名的儲存庫，並向其中加入一個 `README.md` 檔案時，該個人主頁 readme 就會顯示在你的個人主頁頁面上。例如，使用者 [`DenverCoder1`](https://github.com/DenverCoder1) 的儲存庫位於 [`DenverCoder1/DenverCoder1`](https://github.com/DenverCoder1/DenverCoder1)。