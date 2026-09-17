<?php

declare(strict_types=1);

/**
 * 用于将 Google 字体转换为 base 64 以便通过 SVG 图片显示的类
 */
class GoogleFontConverter
{
    /**
     * 从 Google Fonts 获取 CSS
     *
     * @param string $font 要获取的 Google 字体
     * @param string $text 要以该字体显示的文本
     * @return string 用于显示该字体的 CSS
     */
    public static function fetchFontCSS($font, $weight, $text): string
    {
        $url =
            "https://fonts.googleapis.com/css2?" .
            http_build_query([
                "family" => $font . ":wght@" . $weight,
                "text" => $text,
                "display" => "fallback",
            ]);
        try {
            // 获取该字体的 CSS
            $response = self::curlGetContents($url);
            // 找到所有字体文件并将其转换为 base64 数据 URI
            return self::encodeFonts($response);
        } catch (InvalidArgumentException $error) {
            return "";
        }
    }

    /**
     * 将字符串中的字体 url 编码为 base 64
     *
     * @param string $css 来自 Google Fonts 的 CSS
     * @return string url 被替换为 base 64 数据 URI 的 CSS
     */
    private static function encodeFonts($css)
    {
        $urlRegex = '/\((https\:\/\/fonts\.gstatic\.com.+?)\) format\(\'(.*?)\'\)/';
        preg_match_all($urlRegex, $css, $matches);
        $urls = array_combine($matches[1], $matches[2]);
        // 遍历所有链接并替换为数据 URI
        foreach ($urls as $url => $fontType) {
            $response = self::curlGetContents($url);
            $dataURI = "data:font/{$fontType};base64," . base64_encode($response);
            $css = str_replace($url, $dataURI, $css);
        }
        return $css;
    }

    /**
     * 获取一个 URL 的内容
     *
     * @param string $url 要获取的 URL
     * @return string 来自该 URL 的响应
     */
    private static function curlGetContents($url): string
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        // 自 PHP 8.0 起 curl handle 由 GC 自动回收，curl_close() 已是 no-op，
        // 无手动调用必要；移除它以免在 PHP 8.5+ 输出 Deprecated 提示污染 SVG。
        if ($httpCode != ResponseEnum::HTTP_OK->value) {
            throw new InvalidArgumentException("Failed to fetch Google Font from API.");
        }
        return $response;
    }
}
