<?php declare(strict_types=1);

/**
 * 用于渲染打字 SVG 的视图
 */
class RendererView
{
    /**
     * @var RendererModel $model
     */
    private $model;

    /**
     * Renderer 视图的构造函数
     * @param RendererModel $model
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
        extract([
            "lines" => $this->model->lines,
            "font" => $this->model->font,
            "color" => $this->model->color,
            "background" => $this->model->background,
            "size" => $this->model->size,
            "center" => $this->model->center,
            "vCenter" => $this->model->vCenter,
            "width" => $this->model->width,
            "height" => $this->model->height,
            "multiline" => $this->model->multiline,
            "fontCSS" => $this->model->fontCSS,
            "duration" => $this->model->duration,
            "pause" => $this->model->pause,
            "repeat" => $this->model->repeat,
            "letterSpacing" => $this->model->letterSpacing,
        ]);
        // 使用输出缓冲渲染 SVG
        ob_start();
        include $this->model->template;
        $output = ob_get_contents();
        ob_end_clean();
        // 返回渲染后的输出
        return $output;
    }
}
