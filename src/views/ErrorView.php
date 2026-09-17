<?php declare(strict_types=1);

/**
 * 用于渲染错误消息的视图
 */
class ErrorView
{
    /**
     * @var ErrorModel $model
     */
    private $model;

    /**
     * Error 视图的构造函数
     * @param ErrorModel $model
     */
    public function __construct($model)
    {
        $this->model = $model;
    }

    /**
     * 渲染 SVG 输出
     * @return string
     */
    public function render()
    {
        // 将变量导入符号表
        extract(["message" => $this->model->message]);
        // 使用输出缓冲渲染 SVG
        ob_start();
        include $this->model->template;
        $output = ob_get_contents();
        ob_end_clean();
        // 返回渲染后的输出
        return $output;
    }
}
