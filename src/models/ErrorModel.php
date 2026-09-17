<?php declare(strict_types=1);

/**
 * 错误消息模型
 */
class ErrorModel
{
    /** @var string $message 要显示的文本 */
    public string $message;

    /** @var string $template 模板文件路径 */
    public string $template;

    /**
     * 构造 ErrorModel
     *
     * @param string $message 要显示的文本
     * @param string $template 模板文件路径
     */
    public function __construct(string $template, string $message)
    {
        $this->message = $message;
        $this->template = $template;
    }
}
