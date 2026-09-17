# 常见问题（FAQ）

## 如何在我的 Readme 中包含 Readme Typing SVG？

GitHub 上的 Markdown 文件支持使用 Markdown 或 HTML 嵌入图片。你可以在[演示站点](https://readme-typing-svg.demolab.com/demo/)上定制你的 SVG，并通过以下任意方式使用图片源：

### Markdown

```md
[![Typing SVG](https://readme-typing-svg.demolab.com/?lines=First+line+of+text;Second+line+of+text)](https://git.io/typing-svg)
```

### HTML

<!-- prettier-ignore-start -->
```html
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com/?lines=First+line+of+text;Second+line+of+text"/></a>
```
<!-- prettier-ignore-end -->

## 文字在末尾被截断了，怎么修复？

SVG 内渲染的文字宽度是可变的，因此你必须手动指定宽度，以确保文字能够完整显示。

应该增大 URL 中的 `width` 参数，使文字能以完整宽度正确显示。

```md
https://readme-typing-svg.demolab.com/?lines=Your+Long+Message+With+A+Long+Width&width=460
```

## 如何在页面上居中显示图片？

要实现图片居中，你需要使用 HTML 语法，并将其包裹在带有 HTML 属性 `align="center"` 的元素中。

<!-- prettier-ignore-start -->
```html
<p align="center">
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com/?lines=This+image+is+center-aligned&font=Fira%20Code&center=true&width=380&height=50"/></a>
</p>
```
<!-- prettier-ignore-end -->

## 如何在一行中间添加多个空格？

与 HTML 类似，SVG/XML 会将多个连续空格视为单个空格。

一种添加额外空格的变通方法是使用其他空白字符（例如，你可以从 https://qwerty.dev/whitespace 复制粘贴半角空格（en-space）或其他不常见的空格）。这些替代的空白字符不会被忽略。

## 如何为深色模式和浅色模式制作不同的 SVG？

自 2022 年 5 月起，你可以使用 `<picture>` 和 `<source>` 元素来[指定主题上下文](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/)，如下所示。深色模式版本出现在 `<source>` 标签的 `srcset` 中，浅色模式版本出现在 `<img>` 标签的 `src` 中。

<!-- prettier-ignore-start -->
```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://readme-typing-svg.demolab.com/?lines=You+are+using+dark+mode&color=FFFFFF" />
  <img src="https://readme-typing-svg.demolab.com/?lines=You+are+using+light+mode&color=000000" />
</picture>
```
<!-- prettier-ignore-end -->

## 如何为我的个人主页创建 Readme？

当你创建一个与你的用户名同名的仓库，并向其中添加一个 `README.md` 文件时，该个人主页 readme 就会显示在你的个人主页页面上。例如，用户 [`DenverCoder1`](https://github.com/DenverCoder1) 的仓库位于 [`DenverCoder1/DenverCoder1`](https://github.com/DenverCoder1/DenverCoder1)。