<?php

declare(strict_types=1);

/**
 * SVG 输出模型
 */
class RendererModel
{
    /** @var array<string> $lines 要显示的文本 */
    public $lines;

    /** @var string $font 字体族 */
    public $font;

    /** @var string $font 字体粗细 */
    public $weight;

    /** @var string $color 字体颜色 */
    public $color;

    /** @var string $background 背景颜色 */
    public $background;

    /** @var int $size 字号 */
    public $size;

    /** @var bool $center 是否水平居中文本 */
    public $center;

    /** @var bool $vCenter 是否垂直居中文本 */
    public $vCenter;

    /** @var int $width 宽度 (px) */
    public $width;

    /** @var int $height 高度 (px) */
    public $height;

    /** @var bool $multiline True = 换行，False = 在同一行重新输入 */
    public $multiline;

    /** @var int $duration 打印时长（毫秒） */
    public $duration;

    /** @var int $pause 行与行之间的暂停时长（毫秒） */
    public $pause;

    /** @var bool $repeat 是否在末尾循环回到第一行 */
    public $repeat;

    /** @var string $separator 行分隔符 */
    public $separator;

    /** @var bool $random True = 随机顺序排列行 */
    public $random;

    /** @var string $fontCSS 显示所选字体所需的 CSS */
    public $fontCSS;

    /** @var string $letterSpacing 字间距 */
    public $letterSpacing;

    /** @var string $template 模板文件路径 */
    public $template;

    /** @var array<string, string> $DEFAULTS */
    private $DEFAULTS = [
        "font" => "monospace",
        "weight" => "400",
        "color" => "#9A53F7FF",
        "background" => "#101010E6",
        "size" => "20",
        "center" => "false",
        "vCenter" => "false",
        "width" => "400",
        "height" => "50",
        "multiline" => "false",
        "duration" => "5000",
        "pause" => "0",
        "repeat" => "true",
        "separator" => ";",
        "random" => "false",
        "letterSpacing" => "normal",
    ];

    /**
     * 构造 RendererModel
     *
     * @param string $template 模板文件路径
     * @param array<string, string> $params 请求参数
     */
    public function __construct($template, $params)
    {
        $this->template = $template;
        $this->separator = $params["separator"] ?? $this->DEFAULTS["separator"];
        $this->random = $this->checkBoolean($params["random"] ?? $this->DEFAULTS["random"]);
        $this->lines = $this->checkLines($params["lines"] ?? "");
        $this->font = $this->checkFont($params["font"] ?? $this->DEFAULTS["font"]);
        $this->weight = $this->checkNumberPositive($params["weight"] ?? $this->DEFAULTS["weight"], "Font weight");
        $this->color = $this->checkColor($params["color"] ?? $this->DEFAULTS["color"], "color");
        $this->background = $this->checkColor($params["background"] ?? $this->DEFAULTS["background"], "background");
        $this->size = $this->checkNumberPositive($params["size"] ?? $this->DEFAULTS["size"], "Font size");
        $this->center = $this->checkBoolean($params["center"] ?? $this->DEFAULTS["center"]);
        $this->vCenter = $this->checkBoolean($params["vCenter"] ?? $this->DEFAULTS["vCenter"]);
        $this->width = $this->checkNumberPositive($params["width"] ?? $this->DEFAULTS["width"], "Width");
        $this->height = $this->checkNumberPositive($params["height"] ?? $this->DEFAULTS["height"], "Height");
        $this->multiline = $this->checkBoolean($params["multiline"] ?? $this->DEFAULTS["multiline"]);
        $this->duration = $this->checkNumberPositive($params["duration"] ?? $this->DEFAULTS["duration"], "duration");
        $this->pause = $this->checkNumberNonNegative($params["pause"] ?? $this->DEFAULTS["pause"], "pause");
        $this->repeat = $this->checkBoolean($params["repeat"] ?? $this->DEFAULTS["repeat"]);
        $this->fontCSS = $this->fetchFontCSS($this->font, $this->weight, $params["lines"]);
        $this->letterSpacing = $this->checkLetterSpacing($params["letterSpacing"] ?? $this->DEFAULTS["letterSpacing"]);
    }

    /**
     * 校验行数据并返回字符串数组
     *
     * @param string $lines 以分号分隔的 lines 参数
     * @return array<string> 转义后的行数组
     */
    private function checkLines($lines)
    {
        if (!$lines) {
            throw new UnprocessableEntityException("Lines parameter must be set.");
        }
        if (strlen($this->separator) === 1) {
            $lines = rtrim($lines, $this->separator);
        }
        $exploded = explode($this->separator, $lines);
        if ($this->random) {
            shuffle($exploded);
        }
        // 转义特殊字符以防止注入
        return array_map("htmlspecialchars", $exploded);
    }

    /**
     * 校验字体族并返回合法的字符串
     *
     * @param string $font 字体名称参数
     * @return string 净化后的字体名称
     */
    private function checkFont($font)
    {
        // 返回净化后的字体名称
        return preg_replace("/[^0-9A-Za-z\- ]/", "", $font);
    }

    /**
     * 校验字体颜色并返回合法的字符串
     *
     * @param string $color 颜色参数
     * @param string $field 出错时用于显示的字段名
     * @return string 净化后的颜色，前缀带 # 号
     */
    private function checkColor($color, $field)
    {
        $sanitized = (string) preg_replace("/[^0-9A-Fa-f]/", "", $color);
        // 若颜色不是合法长度，则使用默认值
        if (!in_array(strlen($sanitized), [3, 4, 6, 8])) {
            return $this->DEFAULTS[$field];
        }
        // 返回净化后的颜色
        return "#" . $sanitized;
    }

    /**
     * 校验正数数值参数并返回合法的整数
     *
     * @param string $num 要校验的参数
     * @param string $field 出错时用于显示的字段名
     * @return int 净化后的数字和整数
     */
    private function checkNumberPositive($num, $field)
    {
        $digits = intval(preg_replace("/[^0-9\-]/", "", $num));
        if ($digits <= 0) {
            throw new UnprocessableEntityException("$field must be a positive number.");
        }
        return $digits;
    }

    /**
     * 校验非负数数值参数并返回合法的整数
     *
     * @param string $num 要校验的参数
     * @param string $field 出错时用于显示的字段名
     * @return int 净化后的数字和整数
     */
    private function checkNumberNonNegative($num, $field)
    {
        $digits = intval(preg_replace("/[^0-9\-]/", "", $num));
        if ($digits < 0) {
            throw new UnprocessableEntityException("$field must be a non-negative number.");
        }
        return $digits;
    }

    /**
     * 将 "true" 或 "false" 字符串值校验为布尔值
     *
     * @param string $bool 以字符串形式给出的布尔参数
     * @return boolean $bool 是否等于 "true"
     */
    private function checkBoolean($bool)
    {
        return strtolower($bool) == "true";
    }

    /**
     * 从 Google Fonts 获取带 Base-64 编码的 CSS
     *
     * @param string $font 要获取的 Google 字体
     * @param string $text 要以该字体显示的文本
     * @return string 用于显示该字体的 CSS
     */
    private function fetchFontCSS($font, $weight, $text)
    {
        // 本网站自托管的中文字体
        if ($font === "CangErJinKai") {
            return "<style>\n@font-face {\nfont-family: 'CangErJinKai';\nsrc: url('https://dk-bucket.dominic.dpdns.org/picgo/2026/09/171056-88a.ttf') format('truetype');\n}\n</style>\n";
        }
        // 若保持默认值则跳过检查
        if ($font != $this->DEFAULTS["font"]) {
            // 从 Google Fonts 获取并转换
            $from_google_fonts = GoogleFontConverter::fetchFontCSS($font, $weight, $text);
            if ($from_google_fonts) {
                // 返回用于显示该字体的 CSS
                return "<style>\n{$from_google_fonts}</style>\n";
            }
        }
        // 字体未找到
        return "";
    }

    /**
     * 校验尺寸属性的单位
     *
     * 此方法校验给定的单位是否为合法的 CSS 尺寸单位。
     * 支持 px、em、rem、pt、pc、in、cm、mm、
     * ex、ch、vh、vw、vmin、vmax 以及百分比等各种单位。
     *
     * @param string $unit 要校验的单位
     * @return bool 校验通过返回 true，否则返回 false
     */
    private function isValidUnit($unit)
    {
        return (bool) preg_match("/^(-?\\d+(\\.\\d+)?(px|em|rem|pt|pc|in|cm|mm|ex|ch|vh|vw|vmin|vmax|%))$/", $unit);
    }

    /**
     * 校验字间距
     *
     * 此方法校验字体的字间距属性。
     * 允许特定的关键字（normal、inherit、initial、revert、revert-layer、unset）
     * 以及合法的 CSS 尺寸单位。
     *
     * @param string $letterSpacing 要校验的字间距
     * @return string 校验后的字间距
     */
    private function checkLetterSpacing($letterSpacing)
    {
        // 字间距的合法关键字列表
        $keywords = "normal|inherit|initial|revert|revert-layer|unset";

        // 校验输入是否匹配某个关键字或合法单位
        if (preg_match("/^($keywords)$/", $letterSpacing) || $this->isValidUnit($letterSpacing)) {
            return $letterSpacing;
        }

        // 若输入不合法，则返回默认的字间距值
        return $this->DEFAULTS["letterSpacing"];
    }
}
